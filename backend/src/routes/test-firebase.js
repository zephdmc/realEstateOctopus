// src/routes/test-firebase.js
const express = require('express');
const admin = require('../config/firebase');
const router = express.Router();

router.get('/firebase-status', async (req, res) => {
  try {
    console.log('🧪 Testing Firebase Admin SDK...');
    
    // Test if Firebase is properly initialized
    const auth = admin.auth();
    
    // Try a simple operation
    const projectId = admin.app().options.projectId;
    console.log('📋 Firebase Project ID:', projectId);
    
    // Try to get the current user (this will test the credentials)
    const testToken = req.headers.authorization?.replace('Bearer ', '');
    let userInfo = null;
    
    if (testToken) {
      try {
        const decodedToken = await auth.verifyIdToken(testToken);
        userInfo = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name
        };
        console.log('✅ Token verification successful for user:', userInfo.email);
      } catch (tokenError) {
        console.log('ℹ️ Token verification failed:', tokenError.message);
      }
    }
    
    res.json({
      success: true,
      message: 'Firebase test completed',
      projectId: projectId,
      user: userInfo,
      serverTime: new Date().toISOString(),
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      serverTime: new Date().toISOString(),
      details: 'Firebase Admin SDK is not properly configured'
    });
  }
});

module.exports = router;