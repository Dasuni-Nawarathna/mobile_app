import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Brand } from '@/constants/brand';
import { useAuth } from '@/contexts/auth-context';

export default function Index() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Brand.antiqueGold} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/home" />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Brand.deepEmerald,
  },
});
