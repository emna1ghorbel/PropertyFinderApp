import React from 'react';
import { Text, View } from 'react-native';
import { useSession } from '../ctx';

export default function AppLayout() {
  // React.useEffect(() => {
  //   router.push('/(tabs)/homescreen');
  // }, []);
  const { session, isLoading } = useSession();
return (

  // You can keep the splash screen open, or render a loading screen like we do here.
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Loading...</Text>
  </View>
)
}
