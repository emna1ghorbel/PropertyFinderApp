import { createContext, use, useState, type PropsWithChildren } from 'react';


import { signinWithFirebase } from '@/auth_signin_password';
import { Alert } from 'react-native';
import { useStorageState } from './useStorageState';

import {signupwithfirebase} from '@/auth_signup_password';
const AuthContext = createContext<{
  signUp: (email: string, motDePasse: string) => void;
  signIn: (email: string, motDePasse: string) => void;
  signOut: () => void;
  session?: string | null|undefined;
  isLoading: boolean;
}>({
  signUp: () => null,
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoadingg, session], setSession] = useStorageState('session');
  const [isLoading, setIsLoading] = useState(false);
  const signin = async (email: string, motDePasse: string): Promise<true | string> => {
  setIsLoading(true);
  try {
    const user = await signupwithfirebase(email, motDePasse);

    setSession(user.uid); 
   
    setIsLoading(false);
    return true;
  } catch (error: any) {
    Alert.alert("Erreur Firebase:", error.code);
    setIsLoading(false);
    return error.code ; 
  }
};
const signup = async (email: string, motDePasse: string): Promise<true | string> => {
  setIsLoading(true);
  try {
    const user = await signinWithFirebase(email, motDePasse);

    setSession(user.uid); 
   
    setIsLoading(false);
    return true;
  } catch (error: any) {
    Alert.alert("Erreur Firebase:", error.code);
    setIsLoading(false);
    return error.code ; 
  }
};
  const signout = () => {
  Alert.alert('Sign out');
  setSession(null );
};

  return (
    <AuthContext
      value={{
        signUp: signup,
        signIn: signin,
        signOut: () => {
          signout() ;},
        session,
        isLoading,
      }}>
      {children}
    </AuthContext>
  );
}
