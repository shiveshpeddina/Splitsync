const prisma = require('../prisma');

const getGroupsForUser = async (userId) => {
  const groups = await prisma.group.findMany({
    where: { 
      OR: [
        { members: { some: { userId } } },
        { creatorId: userId }
      ]
    },
    include: {
      members: { include: { user: true } },
      expenses: { include: { splits: true } }
    }
  });

  const friendships = await prisma.friendship.findMany({
    where: { userId }
  });
  
  const aliasMap = {};
  friendships.forEach(f => {
    if (f.alias) aliasMap[f.friendId] = f.alias;
  });

  return groups.map(group => {
    group.members = group.members.map(member => {
      if (aliasMap[member.user.id]) {
        member.user.name = aliasMap[member.user.id];
      }
      return member;
    });
    return group;
  });
};

const createGroup = async (userId, data) => {
  const membersToCreate = [];

  // Optionally include the creator as an admin member
  if (data.includeSelf !== false) {
    membersToCreate.push({ userId, role: 'admin' });
  }

  if (data.memberIds && Array.isArray(data.memberIds)) {
    data.memberIds.forEach(id => {
      if (id !== userId) { // avoid duplicating if already included
        membersToCreate.push({ userId: id, role: 'member' });
      }
    });
  }

  return await prisma.group.create({
    data: {
      name: data.name,
      emoji: data.emoji,
      baseCurrency: data.baseCurrency || 'INR',
      creatorId: userId,
      members: {
        create: membersToCreate
      }
    },
    include: { 
      members: { include: { user: true } },
      expenses: { include: { splits: true } }
    }
  });
};

const getGroupById = async (groupId, userId) => {
  const group = await prisma.group.findUnique({
    where: { id: groupId, members: { some: { userId } } },
    include: { members: { include: { user: true } }, expenses: { include: { splits: true, payer: true } } }
  });

  if (!group) return null;

  const friendships = await prisma.friendship.findMany({
    where: { userId }
  });
  
  const aliasMap = {};
  friendships.forEach(f => {
    if (f.alias) aliasMap[f.friendId] = f.alias;
  });

  group.members = group.members.map(member => {
    if (aliasMap[member.user.id]) {
      member.user.name = aliasMap[member.user.id];
    }
    return member;
  });

  return group;
};

const addMemberToGroup = async (groupId, targetUserId) => {
  return await prisma.groupMember.create({
    data: {
      groupId,
      userId: targetUserId,
      role: 'member'
    }
  });
};

const deleteGroup = async (groupId, userId) => {
  const group = await prisma.group.findUnique({
    where: { id: groupId }
  });

  if (!group) {
    throw new Error('Group not found');
  }

  // Allow anyone to delete the group per user request
  return await prisma.$transaction(async (tx) => {
    await tx.split.deleteMany({
      where: { expense: { groupId } }
    });
    await tx.expense.deleteMany({
      where: { groupId }
    });
    await tx.groupMember.deleteMany({
      where: { groupId }
    });
    return await tx.group.delete({
      where: { id: groupId }
    });
  });
};

const removeMemberFromGroup = async (groupId, targetUserId, requestingUserId) => {
  // Don't allow removing self if you're the only admin
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { members: true }
  });

  if (!group) throw new Error('Group not found');

  const memberRecord = group.members.find(m => m.userId === targetUserId);
  if (!memberRecord) throw new Error('User is not a member of this group');

  // If member is admin and is the only admin, prevent removal
  if (memberRecord.role === 'admin') {
    const adminCount = group.members.filter(m => m.role === 'admin').length;
    if (adminCount <= 1) {
      throw new Error('Cannot remove the only admin from the group');
    }
  }

  // Remove the member's splits from expenses in this group, then remove GroupMember
  return await prisma.$transaction(async (tx) => {
    // Delete splits for this user in this group's expenses
    await tx.split.deleteMany({
      where: {
        userId: targetUserId,
        expense: { groupId }
      }
    });

    // Remove GroupMember record
    await tx.groupMember.delete({
      where: { id: memberRecord.id }
    });

    return { removed: true };
  });
};

module.exports = {
  getGroupsForUser,
  createGroup,
  getGroupById,
  addMemberToGroup,
  removeMemberFromGroup,
  deleteGroup
};
