import { getFirestore, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { Property } from "@/constants/types"; // ton interface Property
import { useSession } from "@/components/context/ctx"; // si tu l'utilises plus tard
import { useEffect } from "react";

const db = getFirestore();

/**
 * Supprime une propriété des favoris dans Firestore
 *
 * @param property - L'objet propriété à supprimer
 * @param collection - Nom de la collection Firestore
 * @param field - Nom du champ (array) où est stocké le favori
 * @param session - ID utilisateur ou document
 */
export default async function RemoveFromFavorites(
  property: Property,
  collection: string,
  field: string,
  session: string
): Promise<void> {
  try {
    await updateDoc(doc(db, collection, session), {
      [field]: arrayRemove(property),
      updatedAt: new Date(),
    });
    console.log(`✅ Donnée "${property.id}" supprimée pour :`, session);
  } catch (error) {
    console.error("❌ Erreur suppression :", error);
  }
}
