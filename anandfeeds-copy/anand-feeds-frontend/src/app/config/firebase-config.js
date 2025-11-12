import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBp3CPveabs0A0iN6-t385ygKZm-6N5GhQ",
  authDomain: "anand-feeds-bdd31.firebaseapp.com",
  projectId: "anand-feeds-bdd31",
  storageBucket: "anand-feeds-bdd31.appspot.com", 
  messagingSenderId: "197741621267",
  appId: "1:197741621267:web:60502b5f6220b428f14fe6",
  measurementId: "G-LM7E508B9N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
