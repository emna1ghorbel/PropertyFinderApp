import { Stack } from "expo-router";
import { useTheme } from '@react-navigation/native';

export default function AuthLayout() {
  const { colors } = useTheme();
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Welcome" }} />
      <Stack.Screen name="signin" options={{ title: "Sign In" }} />
      <Stack.Screen name="signup" options={{ title: "Create Account" }} />
    </Stack>
  );
}
