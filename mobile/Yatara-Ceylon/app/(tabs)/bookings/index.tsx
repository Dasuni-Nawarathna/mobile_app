import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Brand } from '@/constants/brand';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api/client';
import { listBookings } from '@/lib/api/services/bookings';
import type { BookingListItem } from '@/types/api';

export default function BookingsListScreen() {
  const { token } = useAuth();
  const [rows, setRows] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const res = await listBookings(token, { limit: 50 });
      setRows(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Brand.deepEmerald} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {error ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{error}</Text>
        </View>
      ) : null}
      <FlatList
        data={rows}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No bookings yet. Tap + to send a concierge request.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.bookingNo ?? item._id}</Text>
            <Text style={styles.meta}>{item.customerName}</Text>
            <Text style={[styles.status, statusStyle(item.status)]}>{item.status ?? '—'}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function statusStyle(status?: string) {
  const s = (status ?? '').toUpperCase();
  if (s === 'CONFIRMED') return { color: '#047857' };
  if (s === 'PENDING') return { color: '#B45309' };
  return { color: Brand.muted };
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.offWhite },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 32 },
  row: {
    backgroundColor: Brand.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  rowTitle: { fontSize: 17, fontWeight: '700', color: Brand.deepEmerald },
  meta: { fontSize: 14, color: Brand.muted, marginTop: 4 },
  status: { fontSize: 13, fontWeight: '700', marginTop: 8, textTransform: 'capitalize' },
  empty: { textAlign: 'center', color: Brand.muted, marginTop: 40, paddingHorizontal: 24 },
  banner: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  bannerText: { color: Brand.danger },
});
