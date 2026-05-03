import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Brand } from '@/constants/brand';
import { getApiBaseUrl } from '@/constants/config';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api/client';
import { healthCheck } from '@/lib/api/services/health';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [health, setHealth] = useState<string | null>(null);
  const [healthDetail, setHealthDetail] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadHealth = useCallback(async () => {
    try {
      const h = await healthCheck();
      setHealth(h.status === 'ok' ? 'Online' : h.status);
      setHealthDetail(h.message ?? null);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Unreachable';
      setHealth('Unreachable');
      setHealthDetail(msg);
    }
  }, []);

  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  async function onRefresh() {
    setRefreshing(true);
    await loadHealth();
    setRefreshing(false);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Text style={styles.kicker}>Yatara Ceylon</Text>
      <Text style={styles.headline}>Welcome back</Text>
      <Text style={styles.name}>
        {user?.firstName} {user?.lastName}
      </Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Concierge companion</Text>
        <Text style={styles.cardBody}>
          Explore signature journeys and raise transfer requests synced with your concierge team.
        </Text>
      </View>

      <View style={styles.grid}>
        <Pressable style={styles.tile} onPress={() => router.push('/journeys')}>
          <Text style={styles.tileLabel}>Browse journeys</Text>
          <Text style={styles.tileHint}>Premium routes & packages</Text>
        </Pressable>
        <Pressable style={styles.tile} onPress={() => router.push('/bookings')}>
          <Text style={styles.tileLabel}>My bookings</Text>
          <Text style={styles.tileHint}>Reservations & status</Text>
        </Pressable>
      </View>

      <View style={styles.apiCard}>
        <Text style={styles.apiTitle}>Hosted API status</Text>
        <Text style={[styles.apiStatus, health === 'Online' ? styles.online : styles.offline]}>
          {health ?? 'Checking…'}
        </Text>
        {healthDetail ? <Text style={styles.apiMuted}>{healthDetail}</Text> : null}
        <Text style={styles.apiMutedSmall}>Connected to{'\n'}{getApiBaseUrl()}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.offWhite },
  content: { padding: 24, paddingBottom: 48 },
  kicker: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Brand.antiqueGold,
    marginBottom: 8,
    fontWeight: '700',
  },
  headline: { fontSize: 28, fontWeight: '800', color: Brand.deepEmerald },
  name: { fontSize: 22, fontWeight: '700', color: Brand.deepEmerald, marginTop: 6 },
  email: { fontSize: 15, color: Brand.muted, marginTop: 4 },
  card: {
    marginTop: 24,
    backgroundColor: Brand.deepEmerald,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
  },
  cardTitle: { color: Brand.antiqueGold, fontWeight: '700', fontSize: 16, marginBottom: 8 },
  cardBody: { color: Brand.offWhite, lineHeight: 22, opacity: 0.9 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  tile: {
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: Brand.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    minHeight: 100,
  },
  tileLabel: { fontSize: 16, fontWeight: '700', color: Brand.deepEmerald },
  tileHint: { fontSize: 13, color: Brand.muted, marginTop: 6 },
  apiCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  apiTitle: { fontWeight: '700', color: Brand.deepEmerald, marginBottom: 6 },
  apiStatus: { fontSize: 18, fontWeight: '800' },
  online: { color: '#047857' },
  offline: { color: Brand.danger },
  apiMuted: { color: Brand.muted, marginTop: 6, fontSize: 14 },
  apiMutedSmall: { color: Brand.muted, marginTop: 12, fontSize: 11, lineHeight: 16 },
});
