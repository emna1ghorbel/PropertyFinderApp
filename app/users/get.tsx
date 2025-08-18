import { useEffect, useState } from 'react';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { useSession } from '@/components/context/ctx';

const db = getFirestore();

export default function useGetData(
  userCollection: string,
  field: string
): any[] {
  const { session, isLoading } = useSession();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (isLoading || !session) return;

    const docRef = doc(db, userCollection, session);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data()?.[field];
        setData(userData || []);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, [session, isLoading, userCollection, field]);

  return data;
}
