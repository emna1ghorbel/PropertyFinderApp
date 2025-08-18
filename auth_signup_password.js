import app from './firebaseConfig'; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app); 

export function signupwithfirebase(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("✅ Connecté !");
      console.log("UID:", userCredential.user.uid);
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      
      const errorCode = error.code;
      const errorMessage = error.message;
      throw error; 
    });
}
