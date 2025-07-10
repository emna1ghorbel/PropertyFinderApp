import { useEffect } from 'react';
import { default as AppLayout, default as AuthLayout } from './(auth)/_layout';
import { SessionProvider, useSession } from './ctx';
export default function RootLayout() {
  //return <Slot />;
    const { session, isLoading, isAuthenticated } = useSession();
useEffect(() => {
console.log('Session changed:', session);
}, [isAuthenticated, session]);
console.log('isAuthenticated:', isAuthenticated);
  return (
    <SessionProvider>
      {!isAuthenticated ? (
        <AuthLayout />
      ) : (
        <AppLayout />
      )}
    </SessionProvider>
  )
}
