import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAiu9JFruHnV4nNSdutMmM1DzjvtWukxXo",
  authDomain: "cis371-ee861.firebaseapp.com",
  projectId: "cis371-ee861",
  storageBucket: "cis371-ee861.firebasestorage.app",
  messagingSenderId: "628607970460",
  appId: "1:628607970460:web:455403ef741bba35d49159",
  measurementId: "G-2G0CDQP4J8"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const authentication = getAuth(app);
export const google_authentication = new GoogleAuthProvider();