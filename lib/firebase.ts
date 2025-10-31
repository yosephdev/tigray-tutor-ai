import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

function getFirebaseApp() {
    if (typeof window === 'undefined') {
        // This is the server-side, do not initialize the client app
        return null;
    }

    if (getApps().length > 0) {
        return getApps()[0];
    }
    
    return initializeApp(firebaseConfig);
}

export const firebaseApp = getFirebaseApp();
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getDatabase(firebaseApp) : null;

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  type: 'text' | 'image';
  imageUrl?: string;
  error?: boolean;
}
