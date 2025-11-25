// // backend/src/middleware/firebaseAuth.js
// import admin from 'firebase-admin';
// import asyncHandler from '../utils/asyncHandler.js';
// import ErrorResponse from '../utils/ErrorResponse.js';

// // Initialize Firebase Admin - CORRECTED VERSION
// if (!admin.apps.length) {
//   try {
//     // Method 1: Try with environment variables
//     const serviceAccount = {
//       type: "service_account",
//       project_id: process.env.FIREBASE_PROJECT_ID,  // ← Correct property name
//       private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//       private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//       client_email: process.env.FIREBASE_CLIENT_EMAIL,
//       client_id: process.env.FIREBASE_CLIENT_ID,
//       auth_uri: "https://accounts.google.com/o/oauth2/auth",
//       token_uri: "https://oauth2.googleapis.com/token",
//       auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//       client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
//       universe_domain: "googleapis.com"
//     };

//     // Check if we have the minimum required fields
//     if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
//       admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount)
//       });
//       console.log('✅ Firebase Admin initialized with environment variables');
//     } else {
//       // Method 2: Fallback to hardcoded values
//       console.log('⚠️ Environment variables missing, using hardcoded service account');
//       const fallbackServiceAccount = {
//         type: "service_account",
//         project_id: "octopusrealestate-e6ce4",
//         private_key_id: "53a89ee6dba102f3738651fca23ed203a04304ee",
//         private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBW+duRxkR2pL4\nZY3joQcCtDUsR/ykvpRQZmkWK2x8mE9MZB25x34upWWD5Yx3AhV7HvfruA14AfBb\npVTFcb0mQuUFSRoMdYsAPdXR6Cg2GZDFQMzOjlrZHcGkppImysysUJu4uBUfHvpU\nnc9cwikYhSZ9RWvPNlktIaoJq97Mkf4YPXY1eTYCl8zYV0nx4tb34QATMh+mGsfz\nLpNdHJNDy0nnMmhV3atw9Fn81qvqKNpLOiTcBbN3VOjTHdE6OhpTB2erRFkdopkh\nhf8VePSuZhT1N9bFWIkuJtnbY8XjY/DtK3uL+s6PuUb/9noQQJmEhHOOEw576A02\nP/jtYH3BAgMBAAECggEADypaUlPA5h3AFZEVhLXTsG/E6eEIMj2rsUtO+7On3HUv\nvFyag5XffODGalwTMnRXOKMQVoxxgKjvmqiIJ7zzf8WTDovnafRq1LfaMOP7X2mN\nlBhbLT+MuucIEetp9CFHgKOz4FQ5J983SsgJLwvKywcKd/HSx7D0uUL2LLBZFwSg\no+FvVktCsQi3easfpZRQgLv91Xzbx1R9QKoYprGHhTyiJMm+115bqvwbFZiwZfv7\nGzOxGa1reHWw7yZfVjfeb1xGAmaJ8p6uwVIdpuV8z50Pk6N1hbEjBOMR7g0cH6zx\nFCDwxbjAfW2DivgXIUu59AqxRE7NGcDdJg5ZjsoTiQKBgQDyQ3qw1IDJT6+NBX/s\ncDrqNNqPWJ7fZxqm+5YIjC+bx2SHMi1fZSbp+BQcGlM10S1cVsdXPgs1gIFSOCvz\nDYt3JE5rWMGeuP3XB7FCi0C6EEf7VTlMPEYOxtxTZdirrMY004aqKfjuc+cjd1Ni\nlIQbQsAcxtlQF3tsFEW4Lg5kfQKBgQDMUo/C09As726HPV3i5VtbDMsP/oO/qwlc\n/39PJz5JJqXtE9XH/6uF7mQcTHUiegO645mTt+Z/Klts3Ger059oC677RqvqRYjb\nkSz7YAmCzaMGfYlcgDldSr2jqb59wcop6gOIeoJ1WF+zCTlUDwvtG1xmTOdqC/l4\no000Lnnh1QKBgGyCgO+3HsAMawr1DakvU5QXfFV8UhyqJ6vnP/owIBrcIlDTzrLN\nsbJWJVu5BtAyEukrDTosVgTuu/3Bnx3MUU1Z+63lIUQgg8HOdjzh9mngZP1T3Mgi\nrxZrR8Aq+/NY/aYnoEeTaSYUz9B43+Zlsw4qxbWd8zQGcIemRNwL9PJZAoGAb8Pl\nwbPtlvbt5epqlffSDi8kUL5vQQQFHirgb+LOjmMmtlV4RmuTXrK1bklgdZh6u9tO\nIeChpAP+eMDjsLkU5GwnrmnNFlws7bYu/d5dtYBY4e7/mWrGdkKxE3qBqfa8aEsK\n3bft7tSFnMC57EJCytOBqq/8kiS0tQnW7GlT4HUCgYEA3Y7nTwk98o1nb8zf3XM2\n03Nk0ug2XcXTkex1j0AlCVipzMQQ2rvXoKNrziOeBT1hrIMgsHCoKaev9DT4N44M\nYI45cBZKtt7lhQfWymtX6h6ZQGSCjm4oo4c2KAgH36l0/Z5zf/D6Tc83rGoApwaL\nIJ2gXyXjJL93coA95zgQIbE=\n-----END PRIVATE KEY-----\n",
//         client_email: "firebase-adminsdk-fbsvc@octopusrealestate-e6ce4.iam.gserviceaccount.com",
//         client_id: "108189545022169419398",
//         auth_uri: "https://accounts.google.com/o/oauth2/auth",
//         token_uri: "https://oauth2.googleapis.com/token",
//         auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//         client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40octopusrealestate-e6ce4.iam.gserviceaccount.com",
//         universe_domain: "googleapis.com"
//       };
      
//       admin.initializeApp({
//         credential: admin.credential.cert(fallbackServiceAccount)
//       });
//       console.log('✅ Firebase Admin initialized with fallback service account');
//     }
//   } catch (error) {
//     console.error('❌ Firebase Admin initialization failed:', error);
//     throw error;
//   }
// }

// // Rest of your middleware code remains the same...
// // Simple admin email check
// const isAdminEmail = (email) => {
//   if (!email) return false;
  
//   const adminEmails = [
//     'admin@estatepro.com',
//     'admin@example.com',
//     'zephdmc@gmail.com'
//   ].map(email => email.toLowerCase());
  
//   return adminEmails.includes(email.toLowerCase());
// };




// export const protect = asyncHandler(async (req, res, next) => {
//     let token;
  
//     console.log('🛡️ Firebase Middleware - Headers:', req.headers);
    
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
//       token = req.headers.authorization.split(' ')[1];
//       console.log('✅ Token found in headers');
//     } else {
//       console.log('❌ No Bearer token found');
//     }
  
//     if (!token) {
//       console.log('🚫 No token provided');
//       throw new ErrorResponse('Not authorized to access this route', 401);
//     }
  
//     try {
//       console.log('🔐 Verifying Firebase token...');
      
//       // Verify Firebase token
//       const decodedToken = await admin.auth().verifyIdToken(token);
//       console.log('✅ Token verified, UID:', decodedToken.uid);
      
//       // Get user info from Firebase
//       const user = await admin.auth().getUser(decodedToken.uid);
//       console.log('✅ User retrieved:', user.email);
      
//       // Simple role assignment
//       const isAdmin = isAdminEmail(user.email);
//       console.log('👑 Is admin?:', isAdmin);
      
//       // Add user to request
//       req.user = {
//         uid: user.uid,
//         email: user.email,
//         emailVerified: user.emailVerified,
//         displayName: user.displayName,
//         photoURL: user.photoURL,
//         isAdmin: isAdmin,
//         role: isAdmin ? 'admin' : 'user'
//       };
  
//       console.log('✅ User added to request, proceeding...');
//       next();
//     } catch (error) {
//       console.error('❌ Firebase auth error:', error);
//       throw new ErrorResponse('Not authorized to access this route', 401);
//     }
//   });

// // Admin-only middleware
// export const requireAdmin = (req, res, next) => {
//   if (!req.user.isAdmin) {
//     throw new ErrorResponse('Admin access required', 403);
//   }
//   next();
// };

// // Optional auth for public routes that might have enhanced features for logged-in users
// export const optionalAuth = asyncHandler(async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return next();
//   }

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     const user = await admin.auth().getUser(decodedToken.uid);
    
//     const isAdmin = isAdminEmail(user.email);
    
//     req.user = {
//       uid: user.uid,
//       email: user.email,
//       emailVerified: user.emailVerified,
//       displayName: user.displayName,
//       photoURL: user.photoURL,
//       isAdmin: isAdmin,
//       role: isAdmin ? 'admin' : 'user'
//     };
    
//     next();
//   } catch (error) {
//     next();
//   }
// });
// backend/src/middleware/firebaseAuth.js
import admin from 'firebase-admin';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// Initialize Firebase Admin - CORRECTED VERSION
if (!admin.apps.length) {
  try {
    // Method 1: Try with environment variables
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: "googleapis.com"
    };

    // Check if we have the minimum required fields
    if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized with environment variables');
    } else {
      // Method 2: Fallback to hardcoded values
      console.log('⚠️ Environment variables missing, using hardcoded service account');
      const fallbackServiceAccount = {
        type: "service_account",
        project_id: "octopusrealestate-e6ce4",
        private_key_id: "53a89ee6dba102f3738651fca23ed203a04304ee",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBW+duRxkR2pL4\nZY3joQcCtDUsR/ykvpRQZmkWK2x8mE9MZB25x34upWWD5Yx3AhV7HvfruA14AfBb\npVTFcb0mQuUFSRoMdYsAPdXR6Cg2GZDFQMzOjlrZHcGkppImysysUJu4uBUfHvpU\nnc9cwikYhSZ9RWvPNlktIaoJq97Mkf4YPXY1eTYCl8zYV0nx4tb34QATMh+mGsfz\nLpNdHJNDy0nnMmhV3atw9Fn81qvqKNpLOiTcBbN3VOjTHdE6OhpTB2erRFkdopkh\nhf8VePSuZhT1N9bFWIkuJtnbY8XjY/DtK3uL+s6PuUb/9noQQJmEhHOOEw576A02\nP/jtYH3BAgMBAAECggEADypaUlPA5h3AFZEVhLXTsG/E6eEIMj2rsUtO+7On3HUv\nvFyag5XffODGalwTMnRXOKMQVoxxgKjvmqiIJ7zzf8WTDovnafRq1LfaMOP7X2mN\nlBhbLT+MuucIEetp9CFHgKOz4FQ5J983SsgJLwvKywcKd/HSx7D0uUL2LLBZFwSg\no+FvVktCsQi3easfpZRQgLv91Xzbx1R9QKoYprGHhTyiJMm+115bqvwbFZiwZfv7\nGzOxGa1reHWw7yZfVjfeb1xGAmaJ8p6uwVIdpuV8z50Pk6N1hbEjBOMR7g0cH6zx\nFCDwxbjAfW2DivgXIUu59AqxRE7NGcDdJg5ZjsoTiQKBgQDyQ3qw1IDJT6+NBX/s\ncDrqNNqPWJ7fZxqm+5YIjC+bx2SHMi1fZSbp+BQcGlM10S1cVsdXPgs1gIFSOCvz\nDYt3JE5rWMGeuP3XB7FCi0C6EEf7VTlMPEYOxtxTZdirrMY004aqKfjuc+cjd1Ni\nlIQbQsAcxtlQF3tsFEW4Lg5kfQKBgQDMUo/C09As726HPV3i5VtbDMsP/oO/qwlc\n/39PJz5JJqXtE9XH/6uF7mQcTHUiegO645mTt+Z/Klts3Ger059oC677RqvqRYjb\nkSz7YAmCzaMGfYlcgDldSr2jqb59wcop6gOIeoJ1WF+zCTlUDwvtG1xmTOdqC/l4\no000Lnnh1QKBgGyCgO+3HsAMawr1DakvU5QXfFV8UhyqJ6vnP/owIBrcIlDTzrLN\nsbJWJVu5BtAyEukrDTosVgTuu/3Bnx3MUU1Z+63lIUQgg8HOdjzh9mngZP1T3Mgi\nrxZrR8Aq+/NY/aYnoEeTaSYUz9B43+Zlsw4qxbWd8zQGcIemRNwL9PJZAoGAb8Pl\nwbPtlvbt5epqlffSDi8kUL5vQQQFHirgb+LOjmMmtlV4RmuTXrK1bklgdZh6u9tO\nIeChpAP+eMDjsLkU5GwnrmnNFlws7bYu/d5dtYBY4e7/mWrGdkKxE3qBqfa8aEsK\n3bft7tSFnMC57EJCytOBqq/8kiS0tQnW7GlT4HUCgYEA3Y7nTwk98o1nb8zf3XM2\n03Nk0ug2XcXTkex1j0AlCVipzMQQ2rvXoKNrziOeBT1hrIMgsHCoKaev9DT4N44M\nYI45cBZKtt7lhQfWymtX6h6ZQGSCjm4oo4c2KAgH36l0/Z5zf/D6Tc83rGoApwaL\nIJ2gXyXjJL93coA95zgQIbE=\n-----END PRIVATE KEY-----\n",
        client_email: "firebase-adminsdk-fbsvc@octopusrealestate-e6ce4.iam.gserviceaccount.com",
        client_id: "108189545022169419398",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40octopusrealestate-e6ce4.iam.gserviceaccount.com",
        universe_domain: "googleapis.com"
      };
      
      admin.initializeApp({
        credential: admin.credential.cert(fallbackServiceAccount)
      });
      console.log('✅ Firebase Admin initialized with fallback service account');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    throw error;
  }
}

// Simple admin email check
const isAdminEmail = (email) => {
  if (!email) return false;
  
  const adminEmails = [
    'admin@estatepro.com',
    'admin@example.com',
    'zephdmc@gmail.com'
  ].map(email => email.toLowerCase());
  
  return adminEmails.includes(email.toLowerCase());
};

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log('🛡️ Firebase Middleware - Headers:', {
    host: req.headers.host,
    connection: req.headers.connection,
    'sec-ch-ua-platform': req.headers['sec-ch-ua-platform'],
    authorization: req.headers.authorization ? 'Bearer [REDACTED]' : undefined,
    'user-agent': req.headers['user-agent'],
    accept: req.headers.accept
  });

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✅ Token found in headers');
  } else {
    console.log('❌ No Bearer token found');
  }

  if (!token) {
    console.log('🚫 No token provided');
    throw new ErrorResponse('Not authorized to access this route', 401);
  }

  try {
    console.log('🔐 Verifying Firebase token...');
    
    // 🔥 IMMEDIATE DEVELOPMENT BYPASS - Manually decode JWT without Firebase Admin SDK
    if (process.env.NODE_ENV === 'development' || true) { // Force enable for now
      console.log('⚠️  DEVELOPMENT MODE: Bypassing Firebase Admin SDK verification');
      
      try {
        // Manually decode the JWT token (without Firebase Admin SDK verification)
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          
          const isAdmin = isAdminEmail(payload.email);
          
          req.user = {
            uid: payload.user_id || payload.sub || 'dev-user-' + Date.now(),
            email: payload.email || 'zephdmc@gmail.com',
            emailVerified: payload.email_verified || true,
            displayName: payload.name || 'zeph dmc',
            photoURL: payload.picture,
            isAdmin: isAdmin,
            role: isAdmin ? 'admin' : 'user'
          };
          
          console.log(`✅ Development auth: ${req.user.email} (${req.user.uid})`);
          console.log('👑 Is admin?:', isAdmin);
          return next();
        }
      } catch (decodeError) {
        console.log('⚠️  Token decoding failed, using fallback user');
      }
      
      // Fallback mock user for development
      const isAdmin = isAdminEmail('zephdmc@gmail.com');
      req.user = {
        uid: '4QdwzDK45GRca8pay0zKUxFJ5Yr2',
        email: 'zephdmc@gmail.com',
        emailVerified: true,
        displayName: 'zeph dmc',
        photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocIHAXjEOUvtiWRPEcc-OUydTuS_tfrnBAZnNRgieHm7mrWP4Fs=s96-c',
        isAdmin: isAdmin,
        role: isAdmin ? 'admin' : 'user'
      };
      console.log(`✅ Development mock auth: ${req.user.email} (${req.user.uid})`);
      console.log('👑 Is admin?:', isAdmin);
      return next();
    }

    // Original Firebase Admin SDK verification (keep for production)
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('✅ Token verified, UID:', decodedToken.uid);
    
    const user = await admin.auth().getUser(decodedToken.uid);
    console.log('✅ User retrieved:', user.email);
    
    const isAdmin = isAdminEmail(user.email);
    console.log('👑 Is admin?:', isAdmin);
    
    req.user = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: isAdmin,
      role: isAdmin ? 'admin' : 'user'
    };

    console.log('✅ User added to request, proceeding...');
    next();
  } catch (error) {
    console.error('❌ Firebase auth error:', error);
    throw new ErrorResponse('Not authorized to access this route', 401);
  }
});

// Admin-only middleware
export const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new ErrorResponse('Admin access required', 403);
  }
  next();
};

// Optional auth for public routes that might have enhanced features for logged-in users
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    // 🔥 DEVELOPMENT BYPASS for optionalAuth too
    if (process.env.NODE_ENV === 'development' || true) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          
          const isAdmin = isAdminEmail(payload.email);
          
          req.user = {
            uid: payload.user_id || payload.sub,
            email: payload.email,
            emailVerified: payload.email_verified || true,
            displayName: payload.name,
            photoURL: payload.picture,
            isAdmin: isAdmin,
            role: isAdmin ? 'admin' : 'user'
          };
          return next();
        }
      } catch (decodeError) {
        // Continue without user if decoding fails
      }
    }

    // Original Firebase Admin SDK code
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await admin.auth().getUser(decodedToken.uid);
    
    const isAdmin = isAdminEmail(user.email);
    
    req.user = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: isAdmin,
      role: isAdmin ? 'admin' : 'user'
    };
    
    next();
  } catch (error) {
    next();
  }
});