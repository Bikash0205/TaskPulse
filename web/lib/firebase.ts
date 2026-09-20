import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

export interface FirebaseCustomConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const DEFAULT_FIREBASE_CONFIG: FirebaseCustomConfig = {
  apiKey: "AIzaSyBxqUn_iIBvPwc6NCmO4LAikisI0EoC7Wc",
  authDomain: "taskpulse-app-9921.firebaseapp.com",
  projectId: "taskpulse-app-9921",
  storageBucket: "taskpulse-app-9921.firebasestorage.app",
  messagingSenderId: "31759289651",
  appId: "1:31759289651:web:02756806487c18d95bc246",
};

export const getSavedFirebaseConfig = (): FirebaseCustomConfig => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("taskpulse_firebase_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && parsed.projectId) return parsed;
      } catch (e) {
        console.warn("Failed to parse saved Firebase config", e);
      }
    }
  }
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
  };
};

const activeConfig = getSavedFirebaseConfig();

// Check if Firebase credentials are actively configured
export const isFirebaseConfigured = Boolean(
  activeConfig.apiKey &&
  activeConfig.projectId &&
  activeConfig.apiKey !== "your-api-key-here"
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  } catch (error) {
    console.warn("Firebase initialization error:", error);
  }
}

export const saveFirebaseConfigAndReload = (cfg: FirebaseCustomConfig) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("taskpulse_firebase_config", JSON.stringify(cfg));
    window.location.reload();
  }
};

export { app, auth, db, googleProvider };
