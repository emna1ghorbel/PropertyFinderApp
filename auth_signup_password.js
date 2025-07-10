import app from './firebaseConfig'; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app); 

export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      
      const errorCode = error.code;
      const errorMessage = error.message;
      throw error; 
    });
}
