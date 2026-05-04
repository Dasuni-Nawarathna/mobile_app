import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const GuestProfileScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80' }}
        style={styles.hero}
      >
        <LinearGradient
          colors={['rgba(6,13,11,0.4)', '#060D0B']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="account-circle-outline" size={80} color="#D4AF37" />
            </View>
            
            <Text style={styles.title}>Your Journey Begins Here</Text>
            <Text style={styles.subtitle}>
              Sign in to manage your bookings, save your favorite destinations, and experience bespoke travel in Sri Lanka.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.loginBtn}
                onPress={() => navigation.navigate('Login', { mode: 'login' })}
              >
                <Text style={styles.loginBtnText}>SIGN IN</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.signupBtn}
                onPress={() => navigation.navigate('Login', { mode: 'signup' })}
              >
                <Text style={styles.signupBtnText}>JOIN YATARA CEYLON</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.perks}>
              <View style={styles.perkItem}>
                <MaterialCommunityIcons name="check-decagram" size={20} color="#D4AF37" />
                <Text style={styles.perkText}>Exclusive Member Pricing</Text>
              </View>
              <View style={styles.perkItem}>
                <MaterialCommunityIcons name="check-decagram" size={20} color="#D4AF37" />
                <Text style={styles.perkText}>24/7 Concierge Support</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060D0B' },
  hero: { flex: 1 },
  gradient: { flex: 1, justifyContent: 'center', padding: 30 },
  content: { alignItems: 'center' },
  iconBox: { marginBottom: 24, opacity: 0.8 },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 40, paddingHorizontal: 20 },
  
  buttonContainer: { width: '100%', gap: 16 },
  loginBtn: { 
    backgroundColor: '#D4AF37', height: 56, borderRadius: 16, 
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10
  },
  loginBtnText: { color: '#060D0B', fontWeight: 'bold', letterSpacing: 2, fontSize: 13 },
  
  signupBtn: { 
    height: 56, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(212,175,55,0.4)',
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(212,175,55,0.05)'
  },
  signupBtnText: { color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1, fontSize: 13 },

  perks: { marginTop: 50, gap: 12 },
  perkItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  perkText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' },
});

export default GuestProfileScreen;
