import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPxgn4hRekJY1WNKj3GDec3hyuU2JlUQ",
  authDomain: "tachiyomiapp-ab03e.firebaseapp.com",
  projectId: "tachiyomiapp-ab03e",
  storageBucket: "tachiyomiapp-ab03e.firebasestorage.app",
  messagingSenderId: "567941890555",
  appId: "1:567941890555:web:c8627565b4809e8972cb5e",
  measurementId: "G-QJN6ST9G9S"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos los servicios para usarlos en la App
export const db = getFirestore(app);
export const auth = getAuth(app);