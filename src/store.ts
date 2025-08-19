import { configureStore } from '@reduxjs/toolkit'
import { propertyApi, propertytotal } from './property'
import  firebaseReducer from  './property'
import { setupListeners } from '@reduxjs/toolkit/query'



export const store = configureStore({
  reducer: {
    [propertyApi.reducerPath]: propertyApi.reducer,
    [propertytotal.reducerPath]: propertytotal.reducer,
    firebase: firebaseReducer,
     
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(
    propertyApi.middleware,
    propertytotal.middleware
  ),

  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

