const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currency.controller');

// Removing authMiddleware requirement here so Currency widget can be used universally
router.get('/rates', currencyController.getRates);
router.get('/convert', currencyController.convert);

module.exports = router;
