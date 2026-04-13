import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPsgn44hReKJY1WNKj3GDsc3hyuU2JlUQ", // La llave nueva que sacamos
  authDomain: "tachiyomiapp-ab03e.firebaseapp.com",
  projectId: "tachiyomiapp-ab03e",
  storageBucket: "tachiyomiapp-ab03e.firebasestorage.app",
  messagingSenderId: "567941890555",
  appId: "1:567941890555:web:c8627565b4809e8972cb5e",
  measurementId: "G-QJNKST9G9S"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Forzamos a que la sesión se guarde en el navegador
setPersistence(auth, browserLocalPersistence);