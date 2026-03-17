import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Datos de tu proyecto TachiyomiApp de la consola de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tachiyomiapp-ab03e.firebaseapp.com",
  projectId: "tachiyomiapp-ab03e",
  storageBucket: "tachiyomiapp-ab03e.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializamos la aplicación
const app = initializeApp(firebaseConfig);

// Exportamos la base de datos con el nombre 'db'
export const db = getFirestore(app);