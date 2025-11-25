// src/config/firebaseAuth.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Method 1: Using JSON file (Recommended for quick fix)
const serviceAccountPath = join(__dirname, '..', '..', 'firebase-admin-key.json');

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  
  console.log('Initializing Firebase with project:', serviceAccount.project_id);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  
  // Fallback: Try environment variables
  console.log('Trying environment variables...');
  const serviceAccountEnv = {
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

  if (serviceAccountEnv.project_id && serviceAccountEnv.private_key && serviceAccountEnv.client_email) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountEnv)
    });
    console.log('✅ Firebase Admin initialized from environment variables');
  } else {
    throw new Error('Could not initialize Firebase Admin with any method');
  }
}

export default admin;
export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();