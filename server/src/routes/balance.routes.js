const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const balanceController = require('../controllers/balance.controller');

router.use(authMiddleware);
router.get('/', balanceController.getBalances);
router.post('/settle', balanceController.settle);

module.exports = router;
