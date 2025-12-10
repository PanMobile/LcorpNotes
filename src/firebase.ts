import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Конфиг Firebase.
// Найти можно в Firebase Console -> Project Settings -> General
const firebaseConfig = {
    apiKey: "AIzaSyA7U2Qet8qY3eMMxmliW7_Tc65O9Eq8XpY",
    authDomain: "lcorpnotes.firebaseapp.com",
    projectId: "lcorpnotes",
    storageBucket: "lcorpnotes.firebasestorage.app",
    messagingSenderId: "805344041452",
    appId: "1:805344041452:web:fca4819b549b621d3d48c9"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();