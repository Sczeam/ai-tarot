import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDnlW1kmpWleXB7KKcFR_NggSf0iPpkh5g",
  authDomain: "ai-baydin.firebaseapp.com",
  projectId: "ai-baydin",
  storageBucket: "ai-baydin.appspot.com",
  messagingSenderId: "6273252417",
  appId: "1:6273252417:web:fe78db8b477f6660821ac0",
  measurementId: "G-Y82XQC9P39",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
