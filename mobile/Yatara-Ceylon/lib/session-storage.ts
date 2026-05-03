import * as SecureStore from 'expo-secure-store';

/**
 * Session persistence: SecureStore on native; localStorage fallback on web (SecureStore.native is noop there).
 */

export async function setSessionPayload(key: string, value: string): Promise<void> {
  try {
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
  } catch {
    // fall through
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
    return;
  }

  throw new Error('No session storage available');
}

export async function getSessionPayload(key: string): Promise<string | null> {
  try {
    if (await SecureStore.isAvailableAsync()) {
      return await SecureStore.getItemAsync(key);
    }
  } catch {
    // fall through
  }

  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }

  return null;
}

export async function deleteSessionPayload(key: string): Promise<void> {
  try {
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
  } catch {
    // fall through
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}
