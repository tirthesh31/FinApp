// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import the database function

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy7Ri-lK8M4IA6RDp_lbiZmyZsgRB6e88",
  authDomain: "financial-application-17298.firebaseapp.com",
  projectId: "financial-application-17298",
  storageBucket: "financial-application-17298.appspot.com",
  messagingSenderId: "684516548687",
  appId: "1:684516548687:web:433567cc0d8814507aca3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Get the database instance

export { app, database }; // Export both app and database
