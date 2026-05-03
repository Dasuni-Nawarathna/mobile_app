import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { register, isLoading } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#D4AF37" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => register(name, email, password, phone)}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#060D0B', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#D4AF37', marginBottom: 40 },
  input: { width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#D4AF37', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#060D0B', fontWeight: 'bold', fontSize: 16 },
  linkText: { color: '#fff' }
});

export default RegisterScreen;
