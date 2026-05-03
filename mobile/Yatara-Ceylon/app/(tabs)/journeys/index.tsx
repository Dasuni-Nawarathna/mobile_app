import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Brand } from '@/constants/brand';
import { ApiError } from '@/lib/api/client';
import { listPackages } from '@/lib/api/services/packages';
import type { PackageListItem } from '@/types/api';

export default function JourneysListScreen() {
  const [items, setItems] = useState<PackageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await listPackages({ limit: 50 });
      setItems(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load journeys');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
          <Pressable onPress={load} style={styles.retry}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No journeys returned from the API yet.</Text>
        }
        renderItem={({ item }) => (
          <Link href={`/journeys/${item._id}`} asChild>
            <Pressable style={styles.row}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              {item.durationDays != null ? (
                <Text style={styles.meta}>{item.durationDays} days</Text>
              ) : null}
              <Text style={styles.meta}>
                {item.priceMin != null && item.priceMax != null
                  ? `${item.priceMin.toLocaleString()} – ${item.priceMax.toLocaleString()} (from API)`
                  : 'Pricing on request'}
              </Text>
            </Pressable>
          </Link>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
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
  empty: { textAlign: 'center', color: Brand.muted, marginTop: 32, paddingHorizontal: 24 },
  banner: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  bannerText: { color: Brand.danger, marginBottom: 8 },
  retry: { alignSelf: 'flex-start' },
  retryText: { color: Brand.deepEmerald, fontWeight: '700' },
});
