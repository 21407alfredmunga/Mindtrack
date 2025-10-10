// src/firebase.js

// 1. Import core functions
import { initializeApp } from "firebase/app";

// 2. Import the services needed for the MindTrack project
// Auth is for user management (Login/Register)
import { getAuth } from "firebase/auth";
// Firestore is for storing mood entries, goals, and resources
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAa2o_pAIOVzzd2FGY56fySgJbQ8qPYt0",
  authDomain: "mindtrack-b24cf.firebaseapp.com",
  projectId: "mindtrack-b24cf",
  storageBucket: "mindtrack-b24cf.firebasestorage.app",
  messagingSenderId: "199618190684",
  appId: "1:199618190684:web:5da1ea99a3122bdfbab599"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3. Initialize and EXPORT the services
// This makes 'auth' and 'db' available to your React components
export const auth = getAuth(app); 
export const db = getFirestore(app);

// Note: The variable 'app' is now used to initialize both auth and db.
// No other variable needs to be exported unless you use storage, functions, etc.