const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const friendController = require('../controllers/friend.controller');

router.use(authMiddleware);
router.get('/', friendController.getFriends);
router.post('/add', friendController.addFriend);
router.put('/:friendId', friendController.updateFriendSettings);
router.delete('/:friendId', friendController.deleteFriend);

module.exports = router;
