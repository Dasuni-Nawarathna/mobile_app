import React, { useContext, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, 
  ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Image 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register, isLoading } = useContext(AuthContext);

  const handleSubmit = () => {
    if (authMode === 'login') {
      login(email, password);
    } else {
      register(name, email, password, phone);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80' }} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>← Back to Home</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            
            {/* Glassmorphism Card */}
            <View style={styles.card}>
              
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>YATARA</Text>
                <Text style={styles.logoSubText}>CEYLON</Text>
              </View>

              <Text style={styles.title}>
                {authMode === 'login' ? 'Welcome Back' : 'Join Yatara Ceylon'}
              </Text>
              <Text style={styles.subtitle}>
                {authMode === 'login' ? 'Sign in to access your journeys' : 'Create your exclusive account'}
              </Text>

              {/* Toggle Switch */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  style={[styles.toggleBtn, authMode === 'login' && styles.toggleBtnActive]}
                  onPress={() => setAuthMode('login')}
                >
                  <Text style={[styles.toggleText, authMode === 'login' && styles.toggleTextActive]}>SIGN IN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleBtn, authMode === 'signup' && styles.toggleBtnActive]}
                  onPress={() => setAuthMode('signup')}
                >
                  <Text style={[styles.toggleText, authMode === 'signup' && styles.toggleTextActive]}>SIGN UP</Text>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formContainer}>
                {authMode === 'signup' && (
                  <>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={name}
                        onChangeText={setName}
                      />
                    </View>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </>
                )}

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder={authMode === 'login' ? "Password" : "Create Password"}
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              {isLoading ? (
                <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 20 }} />
              ) : (
                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                  <Text style={styles.submitBtnText}>
                    {authMode === 'login' ? 'ENTER YOUR JOURNEY' : 'CREATE ACCOUNT'}
                  </Text>
                </TouchableOpacity>
              )}

              {authMode === 'login' && (
                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              )}

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  
  card: {
    backgroundColor: 'rgba(10, 20, 15, 0.7)',
    borderRadius: 25,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoText: { color: '#fff', fontSize: 28, fontWeight: 'bold', letterSpacing: 4 },
  logoSubText: { color: '#D4AF37', fontSize: 12, letterSpacing: 6 },
  
  title: { color: '#D4AF37', fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 5 },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 25 },
  
  toggleContainer: { flexDirection: 'row', marginBottom: 25, gap: 10 },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  toggleBtnActive: { borderColor: '#D4AF37', backgroundColor: 'rgba(0,0,0,0.4)' },
  toggleText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  toggleTextActive: { color: '#D4AF37' },
  
  formContainer: { gap: 15 },
  inputWrapper: { position: 'relative' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  
  eyeBtn: { position: 'absolute', right: 15, top: 15 },
  eyeText: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  
  submitBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  submitBtnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 },
  
  forgotBtn: { marginTop: 20, alignItems: 'center' },
  forgotText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecorationLine: 'underline' },
  
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10 },
  backBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});

export default LoginScreen;
