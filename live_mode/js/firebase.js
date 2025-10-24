import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB68ZwHdbSKc_KmYu_UBEPdde6_1giTvy4",
  authDomain: "rivalis-fitness-reimagined.firebaseapp.com",
  projectId: "rivalis-fitness-reimagined",
  storageBucket: "rivalis-fitness-reimagined.firebasestorage.app",
  messagingSenderId: "87398106759",
  appId: "1:87398106759:web:5048a04e7130f8a027da22",
  measurementId: "G-18CRL1DDT8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const db = getFirestore(app);
