import React, { useEffect, useState, useContext } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TouchableOpacity, Alert, RefreshControl,
  ImageBackground, ListRenderItem, Image
} from 'react-native';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Package {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  heroImage?: string;
  price?: number;
  durationDays: number;
}

const PackagesScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await client.get('/packages');
      setPackages(response.data?.packages || response.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPackages();
  };

  const handleBook = (pkg: Package) => {
    Alert.alert(
      pkg.title,
      `Explore this curated journey starting from LKR ${pkg.price?.toLocaleString()}\n\nWould you like to speak with a concierge?`,
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Inquire Now', onPress: () => Alert.alert('Request Sent', 'Our destination specialist will contact you shortly.') },
      ]
    );
  };

  const renderItem: ListRenderItem<Package> = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.packageCard}
      onPress={() => handleBook(item)}
    >
      <ImageBackground
        source={{ uri: item.heroImage || 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80' }}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 20 }}
      >
        <LinearGradient
          colors={['rgba(6,13,11,0.1)', 'rgba(6,13,11,0.9)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardTop}>
            <View style={styles.durationBadge}>
              <MaterialCommunityIcons name="clock-outline" size={12} color="#D4AF37" />
              <Text style={styles.durationText}>{item.durationDays || '5'} DAYS</Text>
            </View>
          </View>

          <View style={styles.cardBottom}>
            <Text style={styles.pkgTitle}>{item.title}</Text>
            <Text style={styles.pkgDesc} numberOfLines={2}>
              {item.description || 'Experience the hidden gems of Sri Lanka with our signature itinerary.'}
            </Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>PRICE PER PERSON</Text>
                <Text style={styles.priceValue}>LKR {Number(item.price || 0).toLocaleString()}</Text>
              </View>
              <View style={styles.exploreBtn}>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#060D0B" />
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Image 
            source={require('../../assets/icon.png')} 
            style={{ width: 40, height: 40, marginBottom: 8 }}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Explore Ceylon</Text>
          <Text style={styles.headerSub}>Bespoke journeys for the modern traveler</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialCommunityIcons name="tune-variant" size={20} color="#D4AF37" />
        </TouchableOpacity>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <FlatList
          data={packages.length > 0 ? packages : [
            { id: '1', title: 'Cultural Triangle & Heritage', price: 155000, durationDays: 6 },
            { id: '2', title: 'Blue Whale & Coastal Serenity', price: 198000, durationDays: 5 },
            { id: '3', title: 'Knuckles Range Trekking Expedition', price: 120000, durationDays: 4 },
            { id: '4', title: 'Colombo City Luxury Escape', price: 85000, durationDays: 2 },
          ]}
          keyExtractor={(item) => (item._id || item.id) as string}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="map-marker-outline" size={60} color="rgba(255,255,255,0.1)" />
              <Text style={styles.emptyText}>No packages found.</Text>
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24,
    borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.1)'
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  headerSub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 },
  
  filterBtn: { 
    width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(212,175,55,0.1)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)'
  },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  listContainer: { padding: 20, paddingBottom: 100 },

  packageCard: { 
    width: '100%', height: 380, marginBottom: 24, borderRadius: 24, 
    elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.5, shadowRadius: 15
  },
  cardImage: { width: '100%', height: '100%' },
  cardGradient: { flex: 1, padding: 24, justifyContent: 'space-between' },
  
  cardTop: { flexDirection: 'row', justifyContent: 'flex-start' },
  durationBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, 
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)' 
  },
  durationText: { color: '#D4AF37', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },

  cardBottom: { gap: 10 },
  pkgTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', lineHeight: 30 },
  pkgDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 20 },

  cardFooter: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', 
    marginTop: 10 
  },
  priceBox: { gap: 2 },
  priceLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  priceValue: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold' },
  
  exploreBtn: { 
    width: 50, height: 50, borderRadius: 16, backgroundColor: '#D4AF37', 
    alignItems: 'center', justifyContent: 'center' 
  },

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: 'rgba(255,255,255,0.2)', marginTop: 16, fontSize: 15 },
});

export default PackagesScreen;
