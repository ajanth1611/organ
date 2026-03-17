import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD1scQYfcVqrGSWKdP9JD-2a8Nzb9M2g3k",
  authDomain: "organova-67566.firebaseapp.com",
  projectId: "organova-67566",
  storageBucket: "organova-67566.firebasestorage.app",
  messagingSenderId: "481607711600",
  appId: "1:481607711600:web:a2ee51361b0f748ef06db5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
