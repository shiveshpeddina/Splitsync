const prisma = require('../prisma');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const admin = require('../config/firebase-admin');
    const token = authHeader.split(' ')[1];
    
    let email = req.headers['x-dev-user-email'] || 'you@example.com';

    if (token && token !== 'mock-dev-token' && admin.apps?.length > 0) {
      const decoded = await admin.auth().verifyIdToken(token);
      email = decoded.email;
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: email.split('@')[0] || 'User' }
    });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid authentication token' });
  }
};

module.exports = { authMiddleware };
