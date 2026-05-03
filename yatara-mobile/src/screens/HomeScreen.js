import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Image, FlatList } from 'react-native';

const FEATURED_PACKAGES = [
  { id: '1', title: 'Wild Safari', image: 'https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?auto=format&fit=crop&q=80', price: 'LKR 45,000' },
  { id: '2', title: 'Heritage Tour', image: 'https://images.unsplash.com/photo-1586524316938-1e434f6bb99a?auto=format&fit=crop&q=80', price: 'LKR 30,000' },
  { id: '3', title: 'Beach Escape', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80', price: 'LKR 25,000' },
];

const CATEGORIES = [
  { id: '1', name: 'Wildlife', icon: '🐘' },
  { id: '2', name: 'Heritage', icon: '🏛️' },
  { id: '3', name: 'Nature', icon: '🍃' },
  { id: '4', name: 'Beaches', icon: '🏖️' },
];

const HomeScreen = ({ navigation }) => {

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity style={styles.featuredCard}>
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Hero Section */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80' }} 
        style={styles.hero}
        imageStyle={{ opacity: 0.6 }}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroSubtitle}>Welcome to</Text>
          <Text style={styles.heroTitle}>Yatara Ceylon</Text>
          <Text style={styles.heroDesc}>Curating the absolute finest luxury travel experiences across the teardrop island.</Text>
          
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ctaBtnText}>Sign In to Discover</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Journeys */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Signature Experiences</Text>
        <FlatList 
          data={FEATURED_PACKAGES}
          renderItem={renderFeaturedItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>

      {/* Why Yatara */}
      <View style={[styles.section, styles.darkSection]}>
        <Text style={styles.sectionTitle}>Why Yatara Ceylon?</Text>
        <Text style={styles.whyText}>• 24/7 Premium Concierge Support</Text>
        <Text style={styles.whyText}>• Handpicked Luxury Villas & Resorts</Text>
        <Text style={styles.whyText}>• Exclusive Access to Hidden Gems</Text>
        <Text style={styles.whyText}>• Chauffeur-Driven Luxury Fleet</Text>
      </View>

      {/* Footer Space */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060D0B' },
  
  hero: { height: 400, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  heroContent: { padding: 20, alignItems: 'center', marginTop: 50 },
  heroSubtitle: { color: '#fff', fontSize: 18, fontWeight: '500', letterSpacing: 2 },
  heroTitle: { color: '#D4AF37', fontSize: 42, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  heroDesc: { color: '#ddd', textAlign: 'center', fontSize: 14, marginBottom: 25, paddingHorizontal: 20 },
  ctaBtn: { backgroundColor: '#D4AF37', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30 },
  ctaBtnText: { color: '#060D0B', fontWeight: 'bold', fontSize: 16 },

  userSection: { margin: 20, padding: 20, backgroundColor: '#111', borderRadius: 15, borderWidth: 1, borderColor: '#333' },
  greeting: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold' },
  roleText: { color: '#888', marginTop: 5, marginBottom: 15 },
  logoutBtn: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#333', borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold' },

  section: { marginTop: 30 },
  darkSection: { backgroundColor: '#111', padding: 20, marginHorizontal: 20, borderRadius: 15, borderWidth: 1, borderColor: '#222' },
  sectionTitle: { color: '#D4AF37', fontSize: 22, fontWeight: 'bold', marginLeft: 20, marginBottom: 15 },
  
  categoryScroll: { paddingHorizontal: 20, gap: 15 },
  categoryCard: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 15, alignItems: 'center', minWidth: 90, borderWidth: 1, borderColor: '#333' },
  categoryIcon: { fontSize: 30, marginBottom: 5 },
  categoryName: { color: '#fff', fontSize: 12, fontWeight: '600' },

  featuredCard: { width: 250, height: 300, marginRight: 15, borderRadius: 15, overflow: 'hidden' },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: 'rgba(0,0,0,0.6)' },
  featuredTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  featuredPrice: { color: '#D4AF37', marginTop: 5, fontWeight: '600' },

  whyText: { color: '#ddd', fontSize: 15, marginBottom: 10, lineHeight: 22 }
});

export default HomeScreen;
