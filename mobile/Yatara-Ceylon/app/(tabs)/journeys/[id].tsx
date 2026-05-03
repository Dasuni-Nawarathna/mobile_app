import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/brand';
import { ApiError } from '@/lib/api/client';
import { getPackage } from '@/lib/api/services/packages';
import type { PackageDetail } from '@/types/api';

export default function JourneyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) {
        setError('Missing journey id');
        setLoading(false);
        return;
      }
      try {
        const data = await getPackage(String(id));
        if (!cancelled) setPkg(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof ApiError ? e.message : 'Failed to load');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Brand.deepEmerald} />
      </View>
    );
  }

  if (error || !pkg) {
    return (
      <View style={styles.centered}>
        <Text style={styles.err}>{error ?? 'Not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{pkg.title}</Text>
      {pkg.type ? (
        <Text style={styles.badge}>{pkg.type}</Text>
      ) : null}
      {pkg.description ? <Text style={styles.desc}>{pkg.description}</Text> : null}
      <View style={styles.facts}>
        {pkg.durationDays != null ? (
          <Text style={styles.fact}>Duration: {pkg.durationDays} days</Text>
        ) : null}
        {pkg.priceMin != null && pkg.priceMax != null ? (
          <Text style={styles.fact}>
            From {pkg.priceMin.toLocaleString()} to {pkg.priceMax.toLocaleString()} per latest API
            response
          </Text>
        ) : null}
      </View>
      <PrimaryButton
        title="Request this journey"
        onPress={() =>
          router.push({
            pathname: '/bookings/new',
            params: { packageId: String(pkg._id), packageTitle: pkg.title },
          })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.offWhite },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '800', color: Brand.deepEmerald },
  badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(4,57,39,0.08)',
    color: Brand.deepEmerald,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  desc: { marginTop: 16, fontSize: 16, lineHeight: 24, color: '#374151' },
  facts: { marginVertical: 20, gap: 8 },
  fact: { fontSize: 15, color: Brand.deepEmerald, fontWeight: '600' },
  err: { color: Brand.danger, textAlign: 'center' },
});
