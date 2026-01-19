// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXUWrdZZR42mD_fKMxwuJT0IRNHmlDmes",
  authDomain: "lumina-bbdac.firebaseapp.com",
  projectId: "lumina-bbdac",
  storageBucket: "lumina-bbdac.firebasestorage.app",
  messagingSenderId: "639493353328",
  appId: "1:639493353328:web:9bb6d5cca234fc043c69b5",
  measurementId: "G-R0JV5NHF48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Analytics optional for now
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
