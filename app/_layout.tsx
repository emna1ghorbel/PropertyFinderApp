import { Stack, } from 'expo-router';
import { Text, View } from 'react-native';

import { SessionProvider, useSession } from '../components/context/ctx';
import { SplashScreenController } from '../components/context/splash';

export default function Root() {
  return (
    <SessionProvider>
      
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session ,isLoading} = useSession();
 console.log('session',session)
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoading}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </Stack.Protected>
      
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      
      

    </Stack>
  );
}