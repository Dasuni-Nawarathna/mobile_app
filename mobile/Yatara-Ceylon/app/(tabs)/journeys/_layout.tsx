import { Stack } from 'expo-router';
import { Brand } from '@/constants/brand';

export default function JourneysLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Brand.offWhite },
        headerTintColor: Brand.deepEmerald,
        headerTitleStyle: { fontWeight: '700', color: Brand.deepEmerald },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Brand.offWhite },
      }}>
      <Stack.Screen name="index" options={{ title: 'Journeys', headerShown: true }} />
      <Stack.Screen name="[id]" options={{ title: 'Journey detail' }} />
    </Stack>
  );
}
