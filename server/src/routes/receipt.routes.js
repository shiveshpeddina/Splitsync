const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const receiptController = require('../controllers/receipt.controller');

router.use(authMiddleware);
router.post('/scan', receiptController.scanReceipt);

module.exports = router;
