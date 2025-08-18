import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/src/store';
import App2 from './appstore';

export default function App() {
  return (
    <Provider store={store}>
      <App2 />
    </Provider>
  );
}
