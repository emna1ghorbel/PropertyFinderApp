import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from './firebaseConfig';

const auth = getAuth(app); 

export function signinWithFirebase(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      
      console.log("✅ Connecté !");
      console.log("UID:", user.uid);
      
     

      
      return user;
    })
    .catch((error) => {
      console.error("❌ Erreur de connexion:", error.code, error.message);
      throw error;
    });
}
