import { Stack } from 'expo-router';
import { Brand } from '@/constants/brand';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Brand.deepEmerald },
        headerTintColor: Brand.antiqueGold,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: Brand.deepEmerald },
      }}>
      <Stack.Screen name="login" options={{ title: 'Sign in' }} />
      <Stack.Screen name="register" options={{ title: 'Create account' }} />
    </Stack>
  );
}
