// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBa9Oas-7JkwBxStoYOqRUGfQB7v15j17w",
  authDomain: "authcard-9bb27.firebaseapp.com",
  projectId: "authcard-9bb27",
  storageBucket: "authcard-9bb27.appspot.com",
  messagingSenderId: "1036482303140",
  appId: "1:1036482303140:web:46e16e5afc67db3f98c231"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


