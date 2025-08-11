import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCDzE2xkBPCPKHhemDyhZW6nYuxc4kvtAQ",
  authDomain: "idtsensor.firebaseapp.com",
  databaseURL: "https://idtsensor-default-rtdb.firebaseio.com/",
  projectId: "idtsensor",
  storageBucket: "idtsensor.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };