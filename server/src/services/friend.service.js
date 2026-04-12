const prisma = require('../prisma');

const getFriendsForUser = async (userId) => {
  const friendships = await prisma.friendship.findMany({
    where: { userId },
    include: { friend: true }
  });
  return friendships.map(f => ({
    ...f.friend,
    alias: f.alias,
    avatar: f.avatar,
    customCurrency: f.customCurrency
  }));
};

const updateFriendSettings = async (userId, friendId, { alias, avatar, customCurrency }) => {
  const updated = await prisma.friendship.update({
    where: {
      userId_friendId: { userId, friendId }
    },
    data: {
      alias: alias !== undefined ? alias : undefined,
      avatar: avatar !== undefined ? avatar : undefined,
      customCurrency: customCurrency !== undefined ? customCurrency : undefined
    },
    include: { friend: true }
  });

  return {
    ...updated.friend,
    alias: updated.alias,
    avatar: updated.avatar,
    customCurrency: updated.customCurrency
  };
};

const addFriend = async (userId, { contact: emailOrPhone, name: customName, currency }) => {
  // Check if they are trying to add by email or phone
  const isEmail = emailOrPhone.includes('@');
  
  let targetUser = await prisma.user.findFirst({
    where: isEmail ? { email: emailOrPhone } : { phone: emailOrPhone }
  });

  if (!targetUser) {
    if (isEmail) {
      // Create ghost user by email
      targetUser = await prisma.user.create({
        data: {
          name: customName || emailOrPhone.split('@')[0],
          email: emailOrPhone,
          homeCurrency: currency || 'INR',
          isGhost: true
        }
      });
    } else {
      // Create ghost user by phone
      const fakeEmail = `ghost_${Date.now()}_${Math.random().toString(36).substring(7)}@ghost.com`;
      targetUser = await prisma.user.create({
        data: {
          name: customName || `User ${emailOrPhone}`,
          email: fakeEmail,
          phone: emailOrPhone,
          homeCurrency: currency || 'INR',
          isGhost: true
        }
      });
    }
  }

  // Prevent adding self
  if (targetUser.id === userId) {
    throw new Error('You cannot add yourself as a friend');
  }

  // Create the specific friendship relation
  try {
    const friendship = await prisma.friendship.create({
      data: {
        userId,
        friendId: targetUser.id,
        alias: customName || null,
        avatar: null,
        customCurrency: currency || null
      },
      include: { friend: true }
    });
    
    // Symmetrical friendship (optional but good for UX)
    await prisma.friendship.create({
      data: {
        userId: targetUser.id,
        friendId: userId
      }
    }).catch(() => {}); // ignore if it already exists

    return { 
      friend: { ...friendship.friend, alias: friendship.alias, avatar: friendship.avatar, customCurrency: friendship.customCurrency },
      isNewGhost: targetUser.isGhost 
    };
  } catch (err) {
    if (err.code === 'P2002') {
      throw new Error('User is already your friend');
    }
    throw err;
  }
};

const deleteFriend = async (userId, friendId) => {
  // 1. Find all groups the requesting user belongs to
  const userGroups = await prisma.groupMember.findMany({
    where: { userId },
    select: { groupId: true }
  });
  const userGroupIds = userGroups.map(g => g.groupId);

  // 2. Find which of those groups the friend is also a member of
  const friendMemberships = await prisma.groupMember.findMany({
    where: {
      userId: friendId,
      groupId: { in: userGroupIds }
    }
  });

  // 3. Remove friend's splits and group memberships from those shared groups
  if (friendMemberships.length > 0) {
    const sharedGroupIds = friendMemberships.map(m => m.groupId);

    await prisma.$transaction(async (tx) => {
      // Delete the friend's splits in those groups
      await tx.split.deleteMany({
        where: {
          userId: friendId,
          expense: { groupId: { in: sharedGroupIds } }
        }
      });

      // Remove GroupMember records
      await tx.groupMember.deleteMany({
        where: {
          userId: friendId,
          groupId: { in: sharedGroupIds }
        }
      });
    });
  }

  // 4. Delete both directions of the friendship
  await prisma.friendship.deleteMany({
    where: {
      OR: [
        { userId, friendId },
        { userId: friendId, friendId: userId }
      ]
    }
  });

  return { deleted: true };
};

module.exports = {
  getFriendsForUser,
  addFriend,
  updateFriendSettings,
  deleteFriend
};
