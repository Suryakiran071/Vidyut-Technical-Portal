import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// Firebase config (replace with your Firebase project config)
const firebaseConfig = {
  apiKey: "AIzaSyBV8nRs_Xp52rZaq9N9Ghs1M3EsjO6I1xo",
  authDomain: "technical-portal.firebaseapp.com",
  projectId: "technical-portal",
  storageBucket: "technical-portal.firebasestorage.app",
  messagingSenderId: "860083037905",
  appId: "1:860083037905:web:125c82925efe63c68e47f0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth and Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);

// Google Auth provider
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithEmailAndPassword, signInWithPopup, db };
