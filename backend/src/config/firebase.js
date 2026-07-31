import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firestoreInstance;

try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_PRIVATE_KEY && !process.env.FIREBASE_PRIVATE_KEY.includes('SAMPLE_KEY')) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      firestoreInstance = admin.firestore();
      console.log('🔥 Firebase Admin SDK initialized successfully');
    }
  } else {
    firestoreInstance = admin.firestore();
  }
} catch (err) {
  console.warn('⚠️ Firebase Admin SDK initialization fallback:', err.message);
}

export const db = firestoreInstance;
