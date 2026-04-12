const groupService = require('../services/group.service');
const { success } = require('../utils/responseHelper');
const prisma = require('../prisma'); // fallback if needed

const getGroups = async (req, res, next) => {
  try {
    const groups = await groupService.getGroupsForUser(req.user.id);
    success(res, groups, 'Groups fetched successfully');
  } catch (err) { next(err); }
};

const createGroup = async (req, res, next) => {
  try {
    const group = await groupService.createGroup(req.user.id, req.body);
    success(res, group, 'Group created successfully', 201);
  } catch (err) { next(err); }
};

const getGroup = async (req, res, next) => {
  try {
    const group = await groupService.getGroupById(req.params.id, req.user.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    success(res, group, 'Group returned');
  } catch (err) { next(err); }
};

const addMember = async (req, res, next) => {
  try {
    const member = await groupService.addMemberToGroup(req.params.id, req.body.userId);
    success(res, member, 'Member added', 201);
  } catch (err) { next(err); }
};

const getInviteLink = async (req, res, next) => {
  try {
    const group = await prisma.group.findUnique({ where: { id: req.params.id } });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    
    // In production, we would check if req.user.id is a member of this group.
    
    success(res, { 
      token: group.inviteToken, 
      inviteLink: `https://splitwave.app/join/${group.inviteToken}` 
    }, 'Invite link generated');
  } catch (err) { next(err); }
};

const deleteGroup = async (req, res, next) => {
  try {
    await groupService.deleteGroup(req.params.id, req.user.id);
    success(res, null, 'Group deleted successfully');
  } catch (err) {
    if (err.message === 'You must be a group admin to delete this group') {
      return res.status(403).json({ success: false, message: err.message });
    }
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const result = await groupService.removeMemberFromGroup(req.params.id, req.params.userId, req.user.id);
    success(res, result, 'Member removed from group');
  } catch (err) {
    if (err.message === 'Cannot remove the only admin from the group') {
      return res.status(403).json({ success: false, message: err.message });
    }
    next(err);
  }
};

module.exports = { getGroups, createGroup, getGroup, addMember, removeMember, getInviteLink, deleteGroup };
