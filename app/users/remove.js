import { getFirestore, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { Property } from '@/constants/types';
import { useSession } from '@/components/context/ctx';
import { useEffect } from 'react';

const db = getFirestore();

export default async function RemoveFromFavorites(property ,collection,field,session) {
       try {
    await updateDoc(doc(db, collection, session), {
      [field]: arrayRemove(property),
      updatedAt: new Date(),
    });
    console.log(`Donnée "${property.id}" supprimée pour :`, session);
  } catch (error) {
    console.error("❌ Erreur suppression :", error);
  }
    };





