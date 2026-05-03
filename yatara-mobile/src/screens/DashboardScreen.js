import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const DashboardScreen = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Overview</Text>
        <Text style={styles.cardText}>Email: {user?.email}</Text>
        <Text style={styles.cardText}>Role: {user?.role}</Text>
        <Text style={[styles.cardText, {fontSize: 10, marginTop: 10}]}>DEBUG DATA:</Text>
        <Text style={[styles.cardText, {fontSize: 10}]}>{JSON.stringify(user)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#060D0B' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#D4AF37', marginTop: 40 },
  subtitle: { fontSize: 16, color: '#fff', marginBottom: 30 },
  card: { backgroundColor: '#111', padding: 20, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  cardTitle: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  cardText: { color: '#ccc', marginBottom: 5 },
  button: { backgroundColor: '#e74c3c', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 'auto', marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default DashboardScreen;
