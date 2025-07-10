import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFTocU3PaXSnfHAvhVcZ-5iHiW4rOhWS0",
  authDomain: "propertyfinderapp-181f8.firebaseapp.com",
  projectId: "propertyfinderapp-181f8",
  storageBucket: "propertyfinderapp-181f8.firebasestorage.app",
  messagingSenderId: "682547983834",
  appId: "1:682547983834:web:475e19beed93adf56cbce3",
  measurementId: "G-ZDDHZE0L49"
};
const app = initializeApp(firebaseConfig);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export default app;