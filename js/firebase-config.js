// Import Firebase core + services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBA8ge2md8rnhJqW2aXRp9PTrO1i0T5tPM",
  authDomain: "app-development-4a3b9.firebaseapp.com",
  projectId: "app-development-4a3b9",
  storageBucket: "app-development-4a3b9.appspot.com",
  messagingSenderId: "969960725290",
  appId: "1:969960725290:web:4fb7ef0df474e01fe49c53",
  measurementId: "G-ZE6WYJHNE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
    
export const auth = getAuth(app);
export const db = getFirestore(app);
