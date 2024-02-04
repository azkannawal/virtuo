import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "movie-web-11c20.firebaseapp.com",
  projectId: "movie-web-11c20",
  storageBucket: "movie-web-11c20.appspot.com",
  messagingSenderId: "67273349157",
  appId: "1:67273349157:web:64a54444d617cf3d2547cc",
  measurementId: "G-HX83NPXGP2",
};

const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
