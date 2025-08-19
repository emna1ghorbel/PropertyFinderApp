import { useEffect } from 'react';
import { getFirestore, doc, setDoc, arrayUnion } from "firebase/firestore";
import { useSession } from '@/components/context/ctx';
import { startMapper } from 'react-native-reanimated';
import { User } from '@/constants/types';

const db = getFirestore();

export  async function AddToFirestore(
  field: string,
  value: any,
  collection: string,
  uid: string
): Promise<void> {
  try {
    await setDoc(
      doc(db, collection, uid),
      {
        [field]: arrayUnion(value),
        updatedAt: new Date(),
      },
      { merge: true }
    );
    console.log(`✅ ${field} ajouté avec succès à ${uid}`);
  } catch (error) {
    console.error("❌ Erreur Firestore :", error);
  }
}



export async function setuser(
  collection: string,
  session: string,
  filed: string,
  state: any,
): Promise<void> {
  console.log(typeof state);
  try {
    await setDoc(
      doc(db, collection, session),
      {
        [filed]: arrayUnion(state),
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("❌ Erreur Firestore hhhhsignup :", error);
  }
}
export default function App() {
  return (
    <>
      <div>hello</div>
    </>
  );
}