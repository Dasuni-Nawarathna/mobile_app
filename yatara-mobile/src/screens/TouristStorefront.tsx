import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ImageBackground, FlatList, ActivityIndicator, RefreshControl, Alert,
  Dimensions, ListRenderItem, Image,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

interface Package {
  _id?: string;
  id?: string;
  title: string;
  heroImage?: string;
  durationDays: number;
  price?: number;
  priceMin?: number;
}

interface Category {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: '1', name: 'Wildlife', icon: 'elephant', color: '#2E7D5B' },
  { id: '2', name: 'Heritage', icon: 'bank', color: '#8D6E63' },
  { id: '3', name: 'Nature', icon: 'leaf', color: '#43A047' },
  { id: '4', name: 'Beaches', icon: 'beach', color: '#039BE5' },
  { id: '5', name: 'Transfers', icon: 'car-side', color: '#546E7A' },
  { id: '6', name: 'Culture', icon: 'drama-masks', color: '#D81B60' },
];

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const TouristStorefront: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await client.get('/packages?status=published&limit=20');
      setPackages(res.data?.packages || res.data || []);
    } catch (e) {
      // silently handle
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
      `From LKR ${pkg.priceMin?.toLocaleString() || 'Ask for price'}\n\nWould you like to request this signature journey?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => Alert.alert('✅ Request Received', 'A concierge will contact you shortly to finalize your itinerary.') 
        },
      ]
    );
  };

  const renderPackage: ListRenderItem<Package> = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.packageCard} 
      onPress={() => handleBook(item)}
    >
      <ImageBackground
        source={{ uri: item.heroImage || 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400' }}
        style={styles.packageImage}
        imageStyle={{ borderRadius: 20 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(6,13,11,0.95)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.pkgBadge}>
              <Text style={styles.pkgBadgeText}>{item.durationDays || '5'} DAYS</Text>
            </View>
            <TouchableOpacity style={styles.wishlistBtn}>
              <MaterialCommunityIcons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.pkgInfo}>
            <Text style={styles.pkgTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.pkgFooter}>
              <View>
                <Text style={styles.pkgPriceLabel}>FROM</Text>
                <Text style={styles.pkgPrice}>LKR {Number(item.price || 0).toLocaleString()}</Text>
              </View>
              <View style={styles.pkgRating}>
                <MaterialCommunityIcons name="star" size={14} color="#D4AF37" />
                <Text style={styles.ratingText}>4.9</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const GuestHeroActions = () => (
    <View style={styles.guestActions}>
      <TouchableOpacity 
        style={styles.guestLoginBtn}
        onPress={() => navigation.navigate('Login', { mode: 'login' })}
      >
        <Text style={styles.guestLoginText}>SIGN IN</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.guestSignupBtn}
        onPress={() => navigation.navigate('Login', { mode: 'signup' })}
      >
        <Text style={styles.guestSignupText}>JOIN US</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.guestSignupBtn, { backgroundColor: 'rgba(212,175,55,0.1)', borderColor: '#D4AF37' }]}
        onPress={() => navigation.navigate('Explore')}
      >
        <Text style={[styles.guestSignupText, { color: '#D4AF37' }]}>EXPLORE</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
      >
        {/* HERO SECTION */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80' }}
          style={styles.hero}
        >
          <LinearGradient
            colors={['rgba(6,13,11,0.2)', 'rgba(6,13,11,1)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroHeader}>
              <View style={styles.userRow}>
                <Image 
                  source={require('../../assets/icon.png')} 
                  style={{ width: 40, height: 40, marginRight: 10 }}
                  resizeMode="contain"
                />
                <View>
                  <Text style={styles.greeting}>Ayubowan, {user?.name?.split(' ')[0] || 'Traveler'}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>GOLD MEMBER</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.notifBtn}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="#fff" />
                <View style={styles.notifDot} />
              </TouchableOpacity>
            </View>
 
            <View style={styles.heroMain}>
              <Text style={styles.heroTag}>CURATED LUXURY</Text>
              <Text style={styles.heroTitle}>Discover The{'\n'}True Essence{'\n'}Of Ceylon</Text>
              
              <TouchableOpacity style={styles.searchBar}>
                <MaterialCommunityIcons name="magnify" size={22} color="rgba(255,255,255,0.4)" />
                <Text style={styles.searchText}>Where to next?</Text>
              </TouchableOpacity>
 
              {!user && <GuestHeroActions />}
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* TRUST STRIP (FLOATING) */}
        <View style={styles.trustWrapper}>
          <BlurView intensity={20} tint="dark" style={styles.trustStrip}>
            <View style={styles.trustItem}>
              <MaterialCommunityIcons name="shield-check" size={16} color="#D4AF37" />
              <Text style={styles.trustText}>Verified</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.trustItem}>
              <MaterialCommunityIcons name="car-limousine" size={16} color="#D4AF37" />
              <Text style={styles.trustText}>Private Fleet</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.trustItem}>
              <MaterialCommunityIcons name="face-agent" size={16} color="#D4AF37" />
              <Text style={styles.trustText}>24/7 Support</Text>
            </View>
          </BlurView>
        </View>

        {/* CATEGORIES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catCard, activeCategory === cat.id && styles.catCardActive]}
                onPress={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              >
                <View style={[styles.catIconBox, { backgroundColor: cat.color + '22' }]}>
                  <MaterialCommunityIcons name={cat.icon} size={28} color={cat.color} />
                </View>
                <Text style={styles.catName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SIGNATURE JOURNEYS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Signature Journeys</Text>
              <Text style={styles.sectionSubText}>Handpicked bespoke experiences</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={packages.length > 0 ? packages : [
                { id: 'd1', title: 'Ella Green Highlands & Tea Trails', price: 185000, durationDays: 4 },
                { id: 'd2', title: 'Yala National Park Safari Expedition', price: 210000, durationDays: 3 },
                { id: 'd3', title: 'Galle Fort & Southern Coast Luxury', price: 155000, durationDays: 5 },
              ]}
              renderItem={renderPackage}
              keyExtractor={(item) => (item._id || item.id) as string}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.packageList}
              snapToInterval={width * 0.75 + 20}
              decelerationRate="fast"
            />
          )}
        </View>

        {/* WHY YATARA BOX */}
        <View style={styles.whyBoxWrapper}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80' }}
            style={styles.whyBox}
            imageStyle={{ borderRadius: 24 }}
          >
            <LinearGradient
              colors={['rgba(212,175,55,0.9)', 'rgba(184,134,11,0.95)']}
              style={styles.whyOverlay}
            >
              <Text style={styles.whyTitle}>The Yatara Promise</Text>
              <Text style={styles.whyDesc}>
                We redefine travel in Sri Lanka by connecting you with the most reliable local infrastructure, 
                verified chauffeurs, and premium properties.
              </Text>
              <TouchableOpacity style={styles.learnMoreBtn}>
                <Text style={styles.learnMoreText}>LEARN MORE</Text>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* FOOTER ACTION */}
        <View style={styles.footer}>
        {user ? (
          <TouchableOpacity style={styles.secondaryBtn} onPress={logout}>
            <MaterialCommunityIcons name="logout" size={18} color="rgba(255,255,255,0.4)" />
            <Text style={styles.secondaryBtnText}>Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.secondaryBtn, { borderColor: '#D4AF37' }]} 
            onPress={() => navigation.navigate('Login', { mode: 'login' })}
          >
            <MaterialCommunityIcons name="login" size={18} color="#D4AF37" />
            <Text style={[styles.secondaryBtnText, { color: '#D4AF37' }]}>Sign In to Your Journey</Text>
          </TouchableOpacity>
        )}
          <Image 
            source={require('../../assets/icon.png')} 
            style={{ width: 60, height: 60, opacity: 0.3 }}
            resizeMode="contain"
          />
          <Text style={styles.version}>YATARA CEYLON V1.0.4</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060D0B' },

  // Hero
  hero: { height: 500, width: '100%' },
  heroGradient: { flex: 1, justifyContent: 'space-between', paddingBottom: 40 },
  heroHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: 60 
  },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarMini: { 
    width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(212,175,55,0.15)', 
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)' 
  },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  notifBtn: { 
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.08)', 
    alignItems: 'center', justifyContent: 'center' 
  },
  notifDot: { 
    position: 'absolute', top: 12, right: 12, width: 8, height: 8, 
    borderRadius: 4, backgroundColor: '#D4AF37', borderWidth: 1.5, borderColor: '#060D0B' 
  },

  heroMain: { paddingHorizontal: 24, marginTop: 'auto' },
  heroTag: { color: '#D4AF37', fontSize: 11, fontWeight: 'bold', letterSpacing: 3, marginBottom: 12 },
  heroTitle: { color: '#fff', fontSize: 44, fontWeight: 'bold', lineHeight: 50, marginBottom: 24 },
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', 
    height: 56, borderRadius: 16, paddingHorizontal: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' 
  },
  searchText: { color: 'rgba(255,255,255,0.4)', marginLeft: 12, fontSize: 15 },

  // Trust Strip
  trustWrapper: { paddingHorizontal: 20, marginTop: -28 },
  trustStrip: { 
    flexDirection: 'row', height: 56, borderRadius: 16, overflow: 'hidden', 
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)', alignItems: 'center' 
  },
  trustItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  trustText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
  vDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)' },

  // Sections
  section: { marginTop: 40 },
  sectionHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', 
    paddingHorizontal: 24, marginBottom: 20 
  },
  sectionTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  sectionSubText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  viewAll: { color: '#D4AF37', fontSize: 13, fontWeight: 'bold' },

  // Categories
  categoryScroll: { paddingHorizontal: 20, gap: 16 },
  catCard: { alignItems: 'center', width: 85 },
  catIconBox: { 
    width: 64, height: 64, borderRadius: 20, alignItems: 'center', 
    justifyContent: 'center', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' 
  },
  catName: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 'bold' },
  catCardActive: { opacity: 1 },

  // Packages
  packageList: { paddingHorizontal: 24, gap: 20 },
  packageCard: { width: width * 0.75, height: 420, borderRadius: 24, overflow: 'hidden' },
  packageImage: { width: '100%', height: '100%' },
  cardGradient: { flex: 1, justifyContent: 'space-between', padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pkgBadge: { 
    backgroundColor: 'rgba(212,175,55,0.95)', paddingHorizontal: 12, 
    paddingVertical: 6, borderRadius: 12 
  },
  pkgBadgeText: { color: '#060D0B', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  wishlistBtn: { 
    width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.3)', 
    alignItems: 'center', justifyContent: 'center' 
  },
  pkgInfo: { gap: 10 },
  pkgTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', lineHeight: 28 },
  pkgFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  pkgPriceLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  pkgPrice: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold' },
  pkgRating: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  // Why Box
  whyBoxWrapper: { paddingHorizontal: 24, marginTop: 40 },
  whyBox: { height: 200, width: '100%' },
  whyOverlay: { flex: 1, borderRadius: 24, padding: 24, justifyContent: 'center' },
  whyTitle: { color: '#060D0B', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  whyDesc: { color: 'rgba(6,13,11,0.8)', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  learnMoreBtn: { 
    backgroundColor: '#060D0B', paddingHorizontal: 16, paddingVertical: 10, 
    borderRadius: 12, alignSelf: 'flex-start' 
  },
  learnMoreText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },

  // Footer
  footer: { marginTop: 60, alignItems: 'center', gap: 20 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  secondaryBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' },
  version: { color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: 2 },

  // Guest Actions
  guestActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  guestLoginBtn: { 
    flex: 1, backgroundColor: '#D4AF37', height: 48, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center' 
  },
  guestLoginText: { color: '#060D0B', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  guestSignupBtn: { 
    flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', height: 48, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' 
  },
  guestSignupText: { color: '#fff', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
});

export default TouristStorefront;
