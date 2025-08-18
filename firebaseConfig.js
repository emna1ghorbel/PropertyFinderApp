

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyCFTocU3PaXSnfHAvhVcZ-5iHiW4rOhWS0",
  authDomain: "propertyfinderapp-181f8.firebaseapp.com",
  projectId: "propertyfinderapp-181f8",
  storageBucket: "propertyfinderapp-181f8.firebasestorage.app",
  messagingSenderId: "682547983834",
  appId: "1:682547983834:web:475e19beed93adf56cbce3",
  measurementId: "G-ZDDHZE0L49"
};
// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);




// Auth
const auth = getAuth(app);



export { app, db, auth };
