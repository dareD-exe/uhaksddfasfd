import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDCS1GpbSmKl8IGMCX3Viv96ZsXy7dSz54",
  authDomain: "zikrverse-7c3b1.firebaseapp.com",
  projectId: "zikrverse-7c3b1",
  storageBucket: "zikrverse-7c3b1.appspot.com",
  messagingSenderId: "1018409373893",
  appId: "1:1018409373893:web:d04e8b069eb0455d34e0ac",
  measurementId: "G-6166TQTTDK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const signInGuest = () => signInAnonymously(auth);
const db = getFirestore(app);  // Initialize Firestore

export { auth, googleProvider, signInGuest, db };
