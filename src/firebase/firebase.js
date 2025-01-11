// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPv7v4fTYUov1EpQzJhqfeQKOdeSELp6Y",
  authDomain: "expense-tracker-ab794.firebaseapp.com",
  projectId: "expense-tracker-ab794",
  storageBucket: "expense-tracker-ab794.firebasestorage.app",
  messagingSenderId: "320804641538",
  appId: "1:320804641538:web:ff63a6433561c5dcc9401b",
  measurementId: "G-8371L776Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };