import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface StatConfig {
  label: string;
  key: string;
  icon: IconName;
  prefix?: string;
}

interface RoleConfig {
  icon: IconName;
  title: string;
  subtitle: string;
  color: string;
  stats: StatConfig[];
}

const ROLE_CONFIG: Record<string, RoleConfig> = {
  DRIVER: {
    icon: 'car',
    title: 'Driver Dashboard',
    subtitle: 'Manage your rides and fleet',
    color: '#1565C0',
    stats: [
      { label: 'Total Rides', key: 'totalRides', icon: 'speedometer' },
      { label: 'Completed', key: 'completed', icon: 'check-circle-outline' },
      { label: 'Pending', key: 'pending', icon: 'clock-outline' },
      { label: 'Revenue', key: 'revenue', icon: 'cash', prefix: 'LKR ' },
    ],
  },
  HOTEL_MANAGER: {
    icon: 'office-building',
    title: 'Property Dashboard',
    subtitle: 'Manage your hotel & bookings',
    color: '#6A1B9A',
    stats: [
      { label: 'Total Bookings', key: 'totalBookings', icon: 'calendar-text' },
      { label: 'Confirmed', key: 'confirmed', icon: 'check-circle-outline' },
      { label: 'Check-Ins Today', key: 'checkInsToday', icon: 'door-open' },
      { label: 'Revenue', key: 'revenue', icon: 'cash', prefix: 'LKR ' },
    ],
  },
  VEHICLE_OWNER: {
    icon: 'bus',
    title: 'Fleet Dashboard',
    subtitle: 'Manage your vehicle fleet',
    color: '#00695C',
    stats: [
      { label: 'Vehicles', key: 'vehicles', icon: 'car-multiple' },
      { label: 'Active', key: 'active', icon: 'check-circle-outline' },
      { label: 'On Trip', key: 'onTrip', icon: 'map-marker-radius' },
      { label: 'Revenue', key: 'revenue', icon: 'cash', prefix: 'LKR ' },
    ],
  },
  HOTEL_OWNER: {
    icon: 'office-building',
    title: 'Property Dashboard',
    subtitle: 'Manage your properties',
    color: '#6A1B9A',
    stats: [
      { label: 'Total Bookings', key: 'totalBookings', icon: 'calendar-text' },
      { label: 'Confirmed', key: 'confirmed', icon: 'check-circle-outline' },
      { label: 'Check-Ins Today', key: 'checkInsToday', icon: 'door-open' },
      { label: 'Revenue', key: 'revenue', icon: 'cash', prefix: 'LKR ' },
    ],
  },
};

interface Booking {
  _id: string;
  bookingNo?: string;
  packageTitle?: string;
  title?: string;
  status: string;
  startDate?: string;
  totalAmount?: number;
}

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const ProviderDashboard: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const config = ROLE_CONFIG[user?.role || ''] || ROLE_CONFIG.DRIVER;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await client.get('/bookings?limit=10');
      setBookings(res.data?.bookings || res.data || []);
    } catch (e) {
      // Show empty state on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  // Compute summary stats from bookings
  const stats: Record<string, number> = {
    totalRides: bookings.length,
    totalBookings: bookings.length,
    vehicles: 0,
    active: 0,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
    confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
    pending: bookings.filter((b) => ['NEW', 'PAYMENT_PENDING'].includes(b.status)).length,
    onTrip: bookings.filter((b) => b.status === 'IN_PROGRESS').length,
    checkInsToday: bookings.filter((b) => {
      const today = new Date().toDateString();
      return b.status === 'CONFIRMED' && b.startDate && new Date(b.startDate).toDateString() === today;
    }).length,
    revenue: bookings
      .filter((b) => b.status === 'COMPLETED')
      .reduce((acc, b) => acc + (b.totalAmount || 0), 0),
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      NEW: '#3498db', PAYMENT_PENDING: '#f39c12', CONFIRMED: '#27ae60',
      ASSIGNED: '#2980b9', IN_PROGRESS: '#9b59b6', COMPLETED: '#27ae60',
      CANCELLED: '#e74c3c',
    };
    return map[status] || '#888';
  };

  const isPendingApproval = user?.status === 'PENDING_APPROVAL';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: config.color + '44' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons name={config.icon} size={32} color="#D4AF37" />
          </View>
          <View>
            <Text style={styles.headerTitle}>{config.title}</Text>
            <Text style={styles.headerSub}>Welcome, {user?.name?.split(' ')[0]}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Pending Approval Banner */}
      {isPendingApproval && (
        <View style={styles.pendingBanner}>
          <MaterialCommunityIcons name="clock-outline" size={28} color="#FFC107" />
          <View style={{ flex: 1 }}>
            <Text style={styles.pendingBannerTitle}>Account Under Review</Text>
            <Text style={styles.pendingBannerText}>
              Our admin team is verifying your profile. You&apos;ll receive access once approved.
            </Text>
          </View>
        </View>
      )}

      {!isPendingApproval && (
        <>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {config.stats.map((stat) => (
              <View key={stat.key} style={styles.statCard}>
                <MaterialCommunityIcons name={stat.icon} size={24} color="#D4AF37" style={{ marginBottom: 8 }} />
                <Text style={styles.statValue}>
                  {stat.prefix || ''}
                  {stat.key === 'revenue'
                    ? stats.revenue.toLocaleString()
                    : stats[stat.key] ?? 0}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionRow}>
              {user?.role === 'DRIVER' && (
                <>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialCommunityIcons name="calendar-clock" size={26} color="#D4AF37" />
                    <Text style={styles.actionLabel}>My Schedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialCommunityIcons name="map-marker-path" size={26} color="#D4AF37" />
                    <Text style={styles.actionLabel}>Active Route</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialCommunityIcons name="message-text-outline" size={26} color="#D4AF37" />
                    <Text style={styles.actionLabel}>Messages</Text>
                  </TouchableOpacity>
                </>
              )}
              {(user?.role === 'HOTEL_MANAGER' || user?.role === 'HOTEL_OWNER') && (
                <>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialCommunityIcons name="bed-outline" size={26} color="#D4AF37" />
                    <Text style={styles.actionLabel}>Rooms</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialCommunityIcons name="clipboard-check-outline" size={26} color="#D4AF37" />
                    <Text style={styles.actionLabel}>Check-Ins</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialCommunityIcons name="chart-bar" size={26} color="#D4AF37" />
                    <Text style={styles.actionLabel}>Reports</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Recent Bookings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Assignments</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#D4AF37" style={{ marginVertical: 20 }} />
            ) : bookings.length > 0 ? (
              bookings.slice(0, 5).map((booking) => (
                <View key={booking._id} style={styles.bookingCard}>
                  <View style={styles.bookingLeft}>
                    <Text style={styles.bookingNo}>{booking.bookingNo || 'YC-XXXX'}</Text>
                    <Text style={styles.bookingTitle} numberOfLines={1}>
                      {booking.packageTitle || booking.title || 'Booking'}
                    </Text>
                    <Text style={styles.bookingDate}>
                      {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'TBD'}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '22' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {booking.status}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={36} color="rgba(255,255,255,0.2)" style={{ marginBottom: 10 }} />
                <Text style={styles.emptyText}>No assignments yet.</Text>
              </View>
            )}
          </View>
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060D0B' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 24, paddingTop: 60, borderBottomWidth: 1,
  },
  headerIconContainer: { marginBottom: 6 },
  headerTitle: { color: '#D4AF37', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 },
  logoutBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  logoutText: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },

  pendingBanner: {
    flexDirection: 'row', margin: 16, padding: 16, backgroundColor: 'rgba(255,193,7,0.08)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,193,7,0.3)', alignItems: 'flex-start', gap: 12,
  },
  pendingBannerTitle: { color: '#FFC107', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  pendingBannerText: { color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 18 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  statCard: {
    flex: 1, minWidth: '44%', backgroundColor: '#0E1E16', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#1E3320', alignItems: 'center',
  },
  statValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textAlign: 'center', letterSpacing: 0.5 },

  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { color: '#D4AF37', fontSize: 17, fontWeight: 'bold', marginBottom: 14 },

  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1, backgroundColor: '#0E1E16', borderRadius: 14, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#1E3320', gap: 8,
  },
  actionLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, textAlign: 'center', fontWeight: '600' },

  bookingCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#0E1E16', borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#1E3320',
  },
  bookingLeft: { flex: 1 },
  bookingNo: { color: '#D4AF37', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 4 },
  bookingTitle: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  bookingDate: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  emptyState: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { color: 'rgba(255,255,255,0.35)', fontSize: 13 },
});

export default ProviderDashboard;
