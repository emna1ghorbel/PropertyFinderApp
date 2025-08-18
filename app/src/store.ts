import { configureStore } from '@reduxjs/toolkit'
import { propertyApi } from './property'
import  firebaseReducer from  './property'
import { setupListeners } from '@reduxjs/toolkit/query'



export const store = configureStore({
  reducer: {
    [propertyApi.reducerPath]: propertyApi.reducer,
    firebase: firebaseReducer,
     
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(propertyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

