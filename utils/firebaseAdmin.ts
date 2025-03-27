import { initializeApp, getApps, App, getApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const serviceKey = process.env.FIREBASE_PRIVATE_KEY;
if (!serviceKey) {
  throw new Error("No firebase service key provided in environment variables");
}

const serviceAccount = serviceKey.replace(/\\n/g, "\n");

let app: App;
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: serviceAccount,
    }),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);
const adminStorage = getStorage(app);

export { app as adminApp, adminDb, FieldValue, adminStorage };
