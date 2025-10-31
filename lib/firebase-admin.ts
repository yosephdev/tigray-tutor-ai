
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

function getAdminApp() {
    // If the app is already initialized, return it.
    if (getApps().length > 0) {
        return getApps()[0];
    }

    // Check if running in a Google Cloud environment (like App Hosting)
    // GOOGLE_CLOUD_PROJECT is an environment variable automatically set in these environments.
    if (process.env.GOOGLE_CLOUD_PROJECT) {
        // Use Application Default Credentials
        return initializeApp({
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        });
    } else {
        // Fallback for local development: use the service account key from .env.local
        if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Admin SDK features will not work in local development.");
            // Return a dummy or partially configured app if you want local client-side to work without server-side admin features.
            // For now, we'll throw an error if server-side features are attempted locally without a key.
            throw new Error("For local development, FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set in .env.local");
        }
        
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        
        return initializeApp({
            credential: cert(serviceAccount),
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        });
    }
}

export function getAdminAuth() {
    return getAuth(getAdminApp());
}

export function getAdminDb() {
    return getFirestore(getAdminApp());
}

export function getAdminDatabase() {
    return getDatabase(getAdminApp());
}
