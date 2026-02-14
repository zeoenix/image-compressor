import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC5rlaBn32luodgUYPM7IPxdvVzndnkNJM",
  authDomain: "image-compressor-fd45b.firebaseapp.com",
  projectId: "image-compressor-fd45b",
  storageBucket: "image-compressor-fd45b.firebasestorage.app",
  messagingSenderId: "758559330120",
  appId: "1:758559330120:web:207c6463ca8479c3092d7d",
  measurementId: "G-FLJHP5DXN4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
