import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-3fvS9DeYGQSzyJGZOiyUbWqgEZQ0YTg",
  authDomain: "fit5032-67cf3.firebaseapp.com",
  projectId: "fit5032-67cf3",
  storageBucket: "fit5032-67cf3.firebasestorage.app",
  messagingSenderId: "847990876607",
  appId: "1:847990876607:web:438afe4304540a0706990a",
  measurementId: "G-85N6FFZ93Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth };