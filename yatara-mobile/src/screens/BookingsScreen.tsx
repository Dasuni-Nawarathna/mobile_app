import React, { useEffect, useState, useContext } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TouchableOpacity, Alert, RefreshControl, ListRenderItem, Image
} from 'react-native';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Booking {
  _id?: string;
  id?: string;
  bookingNo?: string;
  type?: string;
  status?: string;
  totalCost?: number;
  createdAt: string | Date;
}

const BookingsScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await client.get('/bookings');
      setBookings(response.data?.bookings || response.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

  const getStatusStyle = (status?: string): { color: string; icon: IconName } => {
    switch (status) {
      case 'CONFIRMED': return { color: '#27ae60', icon: 'check-circle' };
      case 'NEW': return { color: '#3498db', icon: 'clock-outline' };
      case 'CANCELLED': return { color: '#e74c3c', icon: 'close-circle' };
      default: return { color: '#f39c12', icon: 'alert-circle-outline' };
    }
  };

  const renderItem: ListRenderItem<Booking> = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={styles.bookingCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.bookingId}>{item.bookingNo || 'YC-7721'}</Text>
            <Text style={styles.packageName}>{item.type || 'Signature Journey'}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.color + '15' }]}>
            <MaterialCommunityIcons name={statusStyle.icon} size={14} color={statusStyle.color} />
            <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status || 'PENDING'}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="rgba(255,255,255,0.4)" />
            <Text style={styles.detailText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="cash" size={16} color="#D4AF37" />
            <Text style={styles.priceText}>LKR {item.totalCost?.toLocaleString() || '145,000'}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>View Itinerary</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => Alert.alert('Concierge', 'A travel specialist is assigned to this booking. Contact via WhatsApp?', [{ text: 'Cancel' }, { text: 'Contact' }])}
          >
            <MaterialCommunityIcons name="whatsapp" size={18} color="#D4AF37" />
            <Text style={styles.actionBtnText}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={{ width: 44, height: 44 }}
          resizeMode="contain"
        />
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <FlatList
          data={bookings.length > 0 ? bookings : [
            { id: '1', bookingNo: 'YC-8821', type: 'Highland Escape', totalCost: 155000, status: 'CONFIRMED', createdAt: new Date().toISOString() },
            { id: '2', bookingNo: 'YC-9912', type: 'Safari Expedition', totalCost: 210000, status: 'NEW', createdAt: new Date().toISOString() },
          ]}
          keyExtractor={(item) => (item._id || item.id) as string}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="calendar-blank" size={60} color="rgba(255,255,255,0.1)" />
              <Text style={styles.emptyText}>No bookings found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060D0B' },
  
  header: { 
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 30,
    borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.15)'
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#D4AF37' },
  headerSub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 },
  
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  listContainer: { padding: 20, paddingBottom: 100 },

  bookingCard: { 
    backgroundColor: '#0E1E16', borderRadius: 20, padding: 20, marginBottom: 16, 
    borderWidth: 1, borderColor: '#1E3320', elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  bookingId: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 4 },
  packageName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },

  cardBody: { gap: 10, marginBottom: 20, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  priceText: { color: '#D4AF37', fontSize: 15, fontWeight: 'bold' },

  cardFooter: { flexDirection: 'row', gap: 12 },
  detailsBtn: { 
    flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 12, 
    borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' 
  },
  detailsBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  actionBtn: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    backgroundColor: 'rgba(212,175,55,0.05)', paddingVertical: 12, borderRadius: 12, gap: 8,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.1)'
  },
  actionBtnText: { color: '#D4AF37', fontSize: 12, fontWeight: 'bold' },

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: 'rgba(255,255,255,0.2)', marginTop: 16, fontSize: 15 },
});

export default BookingsScreen;
