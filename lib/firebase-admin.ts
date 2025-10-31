import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

function getAdminApp() {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
    }
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    return initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
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
