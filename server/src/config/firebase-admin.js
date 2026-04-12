const admin = require('firebase-admin');

// Initialize Firebase Admin only if credentials are provided in the environment
try {
  if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace literal \n with actual newlines in private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin Initialized successfully.');
  } else {
    console.warn('Firebase Admin NOT initialized. Missing FIREBASE_PROJECT_ID environment variable. Falling back to Mock Mode if applicable.');
  }
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error);
}

module.exports = admin;
