import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Base URL for the Express API (`backend/`). Override with EXPO_PUBLIC_API_URL.
 * Android emulator: use 10.0.2.2 to reach the host machine's localhost.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const fromExtra = Constants.expoConfig?.extra?.apiUrl as string | undefined;
  if (fromExtra?.trim()) return fromExtra.trim().replace(/\/$/, '');

  if (Platform.OS === 'android') return 'http://10.0.2.2:5000';
  return 'http://127.0.0.1:5000';
}
