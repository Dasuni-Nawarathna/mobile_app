import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';
import { getApiBaseUrl } from '@/constants/config';
import { useAuth } from '@/contexts/auth-context';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  async function onSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Account</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={[styles.label, styles.gap]}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={[styles.label, styles.gap]}>Role</Text>
        <Text style={styles.value}>{user?.role}</Text>
      </View>

      <Text style={[styles.title, styles.section]}>Developer</Text>
      <View style={styles.card}>
        <Text style={styles.label}>API base URL</Text>
        <Text style={styles.mono}>{getApiBaseUrl()}</Text>
        <Text style={styles.hint}>
          Set EXPO_PUBLIC_API_URL for a deployed backend (e.g. https://api.example.com). Restart
          Expo after changing env.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onSignOut}
        disabled={busy}
        style={({ pressed }) => [
          styles.signOut,
          pressed && styles.signOutPressed,
          busy && styles.signOutDisabled,
        ]}>
        <Text style={styles.signOutLabel}>{busy ? 'Signing out…' : 'Sign out'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.offWhite },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: '800', color: Brand.deepEmerald },
  section: { marginTop: 28 },
  card: {
    marginTop: 12,
    backgroundColor: Brand.white,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  label: { fontSize: 12, fontWeight: '700', color: Brand.muted, textTransform: 'uppercase' },
  gap: { marginTop: 14 },
  value: { fontSize: 16, color: Brand.deepEmerald, fontWeight: '600', marginTop: 4 },
  mono: { fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }), marginTop: 6, fontSize: 13, color: '#111827' },
  hint: { marginTop: 12, fontSize: 13, color: Brand.muted, lineHeight: 18 },
  signOut: {
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Brand.deepEmerald,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
  },
  signOutPressed: { opacity: 0.9 },
  signOutDisabled: { opacity: 0.5 },
  signOutLabel: { color: Brand.antiqueGold, fontWeight: '700', fontSize: 16 },
});
