import React, { useContext, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ImageBackground, KeyboardAvoidingView,
  Platform, ScrollView, StatusBar, Image,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

interface RoleData {
  key: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  desc: string;
  color: string;
}

// ─── Role selector data ────────────────────────────────────────
const ROLES: RoleData[] = [
  {
    key: 'TOURIST',
    label: 'Tourist',
    icon: 'earth',
    desc: 'Explore & book journeys',
    color: '#2E7D5B',
  },
  {
    key: 'DRIVER',
    label: 'Driver',
    icon: 'car',
    desc: 'Manage your rides & fleet',
    color: '#1565C0',
  },
  {
    key: 'HOTEL_MANAGER',
    label: 'Hotel Manager',
    icon: 'office-building',
    desc: 'Manage your property',
    color: '#6A1B9A',
  },
];

type RootStackParamList = {
  Login: { mode?: 'login' | 'signup' } | undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ route }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(route?.params?.mode || 'login');
  const [selectedRole, setSelectedRole] = useState('TOURIST');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, register, isLoading } = useContext(AuthContext);

  const handleSubmit = () => {
    if (authMode === 'login') {
      login(email.trim(), password);
    } else {
      register(name.trim(), email.trim(), password, phone.trim(), selectedRole);
    }
  };

  const activeRole = ROLES.find((r) => r.key === selectedRole);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80' }}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/icon.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* Card */}
            <View style={styles.card}>
              {/* Toggle */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleBtn, authMode === 'login' && styles.toggleBtnActive]}
                  onPress={() => setAuthMode('login')}
                >
                  <Text style={[styles.toggleText, authMode === 'login' && styles.toggleTextActive]}>
                    SIGN IN
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, authMode === 'signup' && styles.toggleBtnActive]}
                  onPress={() => setAuthMode('signup')}
                >
                  <Text style={[styles.toggleText, authMode === 'signup' && styles.toggleTextActive]}>
                    JOIN US
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cardTitle}>
                {authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {authMode === 'login'
                  ? 'Sign in and we\'ll direct you to your experience'
                  : 'Tell us who you are and we\'ll set up your space'}
              </Text>

              {/* ── SIGN UP: Role Selector ────────────────────── */}
              {authMode === 'signup' && (
                <View style={styles.roleSection}>
                  <Text style={styles.sectionLabel}>I AM A</Text>
                  <View style={styles.roleGrid}>
                    {ROLES.map((r) => (
                      <TouchableOpacity
                        key={r.key}
                        style={[
                          styles.roleCard,
                          selectedRole === r.key && { borderColor: r.color, backgroundColor: `${r.color}22` },
                        ]}
                        onPress={() => setSelectedRole(r.key)}
                      >
                        <MaterialCommunityIcons name={r.icon} size={24} color={selectedRole === r.key ? r.color : 'rgba(255,255,255,0.5)'} style={{ marginBottom: 6 }} />
                        <Text style={[styles.roleLabel, selectedRole === r.key && { color: r.color }]}>
                          {r.label}
                        </Text>
                        <Text style={styles.roleDesc}>{r.desc}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {selectedRole !== 'TOURIST' && (
                    <View style={styles.pendingNote}>
                      <Text style={styles.pendingNoteText}>
                        <MaterialCommunityIcons name="clock-outline" size={12} /> {activeRole?.label} accounts require admin verification.
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* ── Form Fields ────────────────────────────────── */}
              <View style={styles.formContainer}>
                {authMode === 'signup' && (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>FULL NAME</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Your full name"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={name}
                        onChangeText={setName}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>PHONE (OPTIONAL)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="+94 7X XXX XXXX"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0 }]}
                      placeholder={authMode === 'login' ? 'Enter password' : 'Create password (8+ chars)'}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                      <MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.4)" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* ── Submit ─────────────────────────────────────── */}
              {isLoading ? (
                <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 25 }} />
              ) : (
                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                  <Text style={styles.submitBtnText}>
                    {authMode === 'login' ? 'ENTER YOUR JOURNEY' : 'CREATE ACCOUNT'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Demo credentials hint */}
            <View style={styles.demoHint}>
              <Text style={styles.demoHintText}>
                Demo: admin@yatara.com • tourist@yatara.com • login123
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(4,10,7,0.78)' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingTop: 60, paddingBottom: 40 },

  logoContainer: { alignItems: 'center', marginBottom: 28 },
  logoImage: { width: 180, height: 180 },

  card: {
    backgroundColor: 'rgba(10,20,14,0.82)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 15,
  },

  toggleContainer: { flexDirection: 'row', marginBottom: 22, gap: 10 },
  toggleBtn: {
    flex: 1, paddingVertical: 11, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center',
  },
  toggleBtnActive: { borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)' },
  toggleText: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 'bold', letterSpacing: 1.5 },
  toggleTextActive: { color: '#D4AF37' },

  cardTitle: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  cardSubtitle: { color: 'rgba(255,255,255,0.45)', fontSize: 12, textAlign: 'center', marginBottom: 22, lineHeight: 18 },

  // Role selector
  roleSection: { marginBottom: 20 },
  sectionLabel: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
  roleGrid: { flexDirection: 'row', gap: 10 },
  roleCard: {
    flex: 1, padding: 12, borderRadius: 14, borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center',
  },
  roleLabel: { color: '#fff', fontWeight: '700', fontSize: 11, textAlign: 'center', marginBottom: 3 },
  roleDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 9, textAlign: 'center', lineHeight: 13 },
  pendingNote: {
    marginTop: 10, backgroundColor: 'rgba(255,193,7,0.1)', borderRadius: 10,
    padding: 10, borderWidth: 1, borderColor: 'rgba(255,193,7,0.3)',
  },
  pendingNoteText: { color: '#FFC107', fontSize: 11, textAlign: 'center', lineHeight: 16 },

  // Form
  formContainer: { gap: 14 },
  inputGroup: { gap: 6 },
  inputLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 'bold', letterSpacing: 1.5 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    color: '#fff', height: 48, borderRadius: 12, paddingHorizontal: 15, fontSize: 14,
  },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 10 },

  // Submit
  submitBtn: {
    backgroundColor: '#D4AF37', borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center', marginTop: 22,
    shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
  submitBtnText: { color: '#060D0B', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 },

  demoHint: { marginTop: 18, alignItems: 'center' },
  demoHintText: { color: 'rgba(255,255,255,0.25)', fontSize: 11 },
});

export default LoginScreen;
