const nudgeService = require('../services/nudge.service');
const { success } = require('../utils/responseHelper');

exports.sendNudge = async (req, res, next) => {
  try {
    const { toUserId, groupId, tone } = req.body;
    const result = await nudgeService.sendNudge(req.user.uid, toUserId, groupId, tone);
    
    return success(res, result, 'Nudge sent successfully');
  } catch (error) {
    next(error);
  }
};
