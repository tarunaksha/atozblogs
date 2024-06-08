import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "atozblogs-93843.firebaseapp.com",
    projectId: "atozblogs-93843",
    storageBucket: "atozblogs-93843.appspot.com",
    messagingSenderId: "52947536951",
    appId: "1:52947536951:web:adb6ce75ea2bdb087043b2",
};

export const app = initializeApp(firebaseConfig);