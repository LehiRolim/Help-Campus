import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyACF7hvlxU_ARlntechBysyRM7fjQd4XWw",
  authDomain: "help-campus-b6d64.firebaseapp.com",
  projectId: "help-campus-b6d64",
  storageBucket: "help-campus-b6d64.firebasestorage.app",
  messagingSenderId: "44538956424",
  appId: "1:44538956424:web:5202929fe3dbd0b10ead3d",
};

export const firebaseApp =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);