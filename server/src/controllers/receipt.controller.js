const receiptService = require('../services/receipt.service');
const { success } = require('../utils/responseHelper');

const scanReceipt = async (req, res, next) => {
  try {
    const { image } = req.body; // Expect base64 image data URI
    
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const result = await receiptService.scanReceipt(image);
    
    // Return full scan result: description, total, currency, and items
    success(res, {
      description: result.description,
      total: result.total,
      currency: result.currency,
      items: result.items
    }, 'Receipt scanned successfully');
  } catch (err) { 
    next(err); 
  }
};

module.exports = { scanReceipt };
