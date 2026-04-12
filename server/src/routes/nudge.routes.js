const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { success } = require('../utils/responseHelper');

const { sendNudge } = require('../controllers/nudge.controller');

// POST /api/nudge/send
router.post('/send', authMiddleware, sendNudge);

module.exports = router;
