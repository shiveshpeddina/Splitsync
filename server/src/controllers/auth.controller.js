const authService = require('../services/auth.service');
const { success } = require('../utils/responseHelper');
const admin = require('../config/firebase-admin');

const login = async (req, res, next) => {
  try {
    const { email, name, phone, token, fcmToken, homeCurrency } = req.body;
    
    let verifiedEmail = email;
    let verifiedName = name;
    let verifiedPhone = phone;

    // Verify token if provided and if Firebase Admin is initialized
    if (token && token !== 'mock-dev-token' && admin.apps?.length > 0) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      verifiedEmail = decodedToken.email || email;
      verifiedName = decodedToken.name || decodedToken.displayName || name;
      verifiedPhone = decodedToken.phone_number || phone;
    } else if (token !== 'mock-dev-token' && admin.apps?.length > 0) {
      throw new Error('Authentication token is missing');
    }

    const user = await authService.loginOrCreateUser({ 
      email: verifiedEmail || 'you@example.com', 
      name: verifiedName || (verifiedEmail ? verifiedEmail.split('@')[0] : 'User'), 
      phone: verifiedPhone, 
      fcmToken,
      homeCurrency
    });
    
    success(res, { user, token: token || 'mock-dev-token' }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
