import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAMQVUOnYfLy7G7xYEFKEBNsC2hYbGTetE",
  authDomain: "smart-water-and-fire-detection.firebaseapp.com",
  projectId: "smart-water-and-fire-detection",
  storageBucket: "smart-water-and-fire-detection.firebasestorage.app",
  messagingSenderId: "414751061692",
  appId: "1:414751061692:web:be92873e73ae58bc9402b9"
};

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const database: Database = getDatabase(app);
const firestore: Firestore = getFirestore(app);

console.log('Firebase initialized successfully');

export { auth, database, firestore };
export default app;