import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { AppDispatch } from './store';
import { setFavs } from './property';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

const db = getFirestore();


export const startFavsListener = (userId: string, dispatch: AppDispatch) => {
  const docRef = doc(db, 'users', userId);

  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const userData = docSnap.data().fav;
      dispatch(setFavs(userData));
    }
  });

  return unsubscribe;
};

export const selectFavs = createSelector(
  (state: RootState) => state.firebase.favs,
  (favs) => favs || []
);
