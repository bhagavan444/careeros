// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier
} from "firebase/auth";

// ✅ Firebase config (yours)
const firebaseConfig = {
  apiKey: "AIzaSyAO5Jxn6_jCbDxCtD2hyUtQK0qWCTVJGMU",
  authDomain: "carrerpath-7ca2e.firebaseapp.com",
  projectId: "carrerpath-7ca2e",
  storageBucket: "carrerpath-7ca2e.appspot.com", // fixed typo: .app → .app**spot.com**
  messagingSenderId: "549910884669",
  appId: "1:549910884669:web:c894751454a9ef3a3d5554",
  measurementId: "G-3631J68JMP"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth and Providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// ✅ Optional: expose RecaptchaVerifier if needed
const generateRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: (response) => {
      // reCAPTCHA solved
    },
    "expired-callback": () => {
      alert("Recaptcha expired. Please try again.");
    }
  });
};

export { auth, googleProvider, githubProvider, generateRecaptcha };
