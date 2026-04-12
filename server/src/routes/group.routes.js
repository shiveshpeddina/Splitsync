const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const groupController = require('../controllers/group.controller');

router.use(authMiddleware);
router.get('/', groupController.getGroups);
router.post('/', groupController.createGroup);
router.get('/:id', groupController.getGroup);
router.delete('/:id', groupController.deleteGroup);
router.get('/:id/invite-link', groupController.getInviteLink);
router.post('/:id/members', groupController.addMember);
router.delete('/:id/members/:userId', groupController.removeMember);

module.exports = router;
