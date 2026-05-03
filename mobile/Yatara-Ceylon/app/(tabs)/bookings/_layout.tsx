import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Brand } from '@/constants/brand';

export default function BookingsStackLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Brand.offWhite },
        headerTintColor: Brand.deepEmerald,
        headerTitleStyle: { fontWeight: '700', color: Brand.deepEmerald },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Brand.offWhite },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'My bookings',
          headerShown: true,
          headerRight: () => (
            <Pressable
              accessibilityLabel="New booking request"
              onPress={() => router.push('/bookings/new')}
              style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
              <Ionicons name="add-circle" size={28} color={Brand.antiqueGold} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="new" options={{ title: 'New request' }} />
    </Stack>
  );
}
