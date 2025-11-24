import { initializeApp, cert, getApps, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";
import { env } from "../config/env";

let app: App;

if (getApps().length === 0) {
    let credential;

    if (env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
            credential = cert(serviceAccount);
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT", e);
        }
    } else if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
        credential = cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
    }

    try {
        const options: any = {
            projectId: env.FIREBASE_PROJECT_ID || "demo-project",
        };
        if (credential) {
            options.credential = credential;
        }

        app = initializeApp(options);
        console.log("Firebase Admin initialized successfully");
    } catch (error) {
        console.error("Failed to initialize Firebase Admin:", error);
        throw error;
    }
} else {
    app = getApps()[0];
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
