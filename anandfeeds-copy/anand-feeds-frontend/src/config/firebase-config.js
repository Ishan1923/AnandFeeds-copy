import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBp3CPveabs0A0iN6-t385ygKZm-6N5GhQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "anand-feeds-bdd31.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "anand-feeds-bdd31",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "anand-feeds-bdd31.appspot.com", 
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "197741621267",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:197741621267:web:60502b5f6220b428f14fe6",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-LM7E508B9N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
