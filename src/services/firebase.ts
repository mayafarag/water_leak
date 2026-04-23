import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAMQVUOnYfLy7G7xYEFKEBNsC2hYbGTetE",
  authDomain: "smart-water-and-fire-detection.firebaseapp.com",
  projectId: "smart-water-and-fire-detection",
  storageBucket: "smart-water-and-fire-detection.firebasestorage.app",
  messagingSenderId: "414751061692",
  appId: "1:414751061692:web:be92873e73ae58bc9402b9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const firestore = getFirestore(app);

export default app;