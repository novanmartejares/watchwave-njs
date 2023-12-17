import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseApp = {
  apiKey: "AIzaSyCORF8nvo4Mc1qQnRIhTcqtPUbshR9vd4Q",
  authDomain: "watchwave-ca3cd.firebaseapp.com",
  projectId: "watchwave-ca3cd",
  storageBucket: "watchwave-ca3cd.appspot.com",
  messagingSenderId: "422821315752",
  appId: "1:422821315752:web:4bd69f4a3e254b67e32e9d",
  measurementId: "G-L6ZH6DC6SH",
};

export const app = initializeApp(firebaseApp);
export const auth = getAuth(app);
export const db = getFirestore(app);
