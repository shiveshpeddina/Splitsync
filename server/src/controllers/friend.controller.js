const friendService = require('../services/friend.service');
const { success } = require('../utils/responseHelper');

const getFriends = async (req, res, next) => {
  try {
    const friends = await friendService.getFriendsForUser(req.user.id);
    success(res, friends, 'Friends fetched successfully');
  } catch (err) { next(err); }
};

const addFriend = async (req, res, next) => {
  try {
    const { contact, name, currency } = req.body;
    if (!contact) return res.status(400).json({ success: false, message: 'Please provide an email or phone number' });

    const result = await friendService.addFriend(req.user.id, { contact, name, currency });
    success(res, result, 'Friend added successfully', 201);
  } catch (err) { next(err); }
};

const updateFriendSettings = async (req, res, next) => {
  try {
    const friendId = req.params.friendId;
    const { alias, avatar, customCurrency } = req.body;
    
    if (!friendId) return res.status(400).json({ success: false, message: 'Friend ID is required' });

    const updated = await friendService.updateFriendSettings(req.user.id, friendId, { alias, avatar, customCurrency });
    success(res, updated, 'Friend settings updated');
  } catch (err) { next(err); }
};

const deleteFriend = async (req, res, next) => {
  try {
    const friendId = req.params.friendId;
    if (!friendId) return res.status(400).json({ success: false, message: 'Friend ID is required' });

    await friendService.deleteFriend(req.user.id, friendId);
    success(res, null, 'Friend removed successfully');
  } catch (err) { next(err); }
};

module.exports = { getFriends, addFriend, updateFriendSettings, deleteFriend };
