import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALIJeAFtwoKqs8wOWgpFEuBR0EDAhCFqc",
  authDomain: "project-netaji.firebaseapp.com",
  projectId: "project-netaji",
  storageBucket: "project-netaji.appspot.com",
  messagingSenderId: "272067118468",
  appId: "1:272067118468:web:9a0e17c2778efbb97349d1",
  measurementId: "G-5EP3WMZ741",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
