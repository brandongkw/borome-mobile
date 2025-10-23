import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:        process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string,
  authDomain:    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId:     process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  appId:         process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string,
};

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
