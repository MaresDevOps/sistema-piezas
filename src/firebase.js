import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFn_FGDOOjMGnY2_lRJJMc1McKHb_MO0I",
  authDomain: "nexus-hardware-5b15a.web.app",
  projectId: "nexus-hardware-5b15a",
  storageBucket: "nexus-hardware-5b15a.firebasestorage.app",
  messagingSenderId: "491085597213",
  appId: "1:491085597213:web:0ccfadf926c6613d2fd4f4",
  measurementId: "G-JRJ0WGPGCC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
