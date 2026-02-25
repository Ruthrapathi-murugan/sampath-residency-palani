// Firebase client initialization
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

console.log("Firebase Config Object from .env:", {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? "***HIDDEN***" : "MISSING!"
});

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  // Using initializeFirestore with experimentalAutoDetectLongPolling because
  // strict tracking prevention settings can block Firebase WebSockets and IndexedDB
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch (err) {
  // Initialization may fail in non-browser environments or missing env vars
  console.warn("Firebase init failed:", err.message || err);
}

export { db };
