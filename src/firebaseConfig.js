// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCmZ06N5rY-b_OgilYhFfkLrwBcENmS6Qk",
    authDomain: "health-care-monitoring-0128.firebaseapp.com",
    projectId: "health-care-monitoring-0128",
    storageBucket: "health-care-monitoring-0128.firebasestorage.app",
    messagingSenderId: "669741710545",
    appId: "1:669741710545:web:1dcc4ed89d55a29d05d9f0",
    measurementId: "G-4YVYMV5QGT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword };
