import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/src/store';
import PropertySearchScreen from './rechstore';

export default function App() {
  return (
    <Provider store={store}>
      <PropertySearchScreen />
    </Provider>
  );
}
