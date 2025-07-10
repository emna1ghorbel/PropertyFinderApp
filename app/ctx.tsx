import { createContext, use, useState, type PropsWithChildren } from 'react';

import { signinWithFirebase } from '@/auth_signin_password';
import { useStorageState } from './useStorageState';

const AuthContext = createContext<{
  signIn: (email: string, motDePasse: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signin = async (email: string, motDePasse: string) => {
    console.log('Signing in with session:', email, motDePasse);
    setIsAuthenticated(true);
    const user = await signinWithFirebase(email, motDePasse);
    console.log('User signed in:', user.email);
    setSession(user.email || null);
  }

  return (
    <AuthContext
      value={{
        signIn: (email: string, motDePasse: string) => {
          // Perform sign-in logic here
          signin(email, motDePasse);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
        isAuthenticated
      }}>
      {children}
    </AuthContext>
  );
}
