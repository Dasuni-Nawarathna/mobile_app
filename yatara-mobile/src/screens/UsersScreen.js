import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import client from '../api/client';

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await client.get('/users');
      setUsers(response.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingId) {
        await client.patch(`/users/${editingId}`, { name, phone });
        Alert.alert('Success', 'User profile updated');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update user');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm Deactivation', 'Are you sure you want to deactivate this account?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Deactivate', 
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await client.delete(`/users/${id}`);
            fetchUsers();
          } catch (e) {
            Alert.alert('Error', 'Failed to deactivate user');
            setLoading(false);
          }
        }
      }
    ]);
  };

  const openEditModal = (user) => {
    setEditingId(user._id);
    setName(user.name);
    setPhone(user.phone || '');
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.text}>{item.email}</Text>
        <Text style={styles.roleText}>{item.role}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.btn, styles.editBtn]} onPress={() => openEditModal(item)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={() => handleDelete(item._id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accounts (Module 1)</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{color: '#fff', marginTop: 20}}>No users found.</Text>}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit User</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name *"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#060D0B' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#D4AF37', marginTop: 30, marginBottom: 20 },
  card: { backgroundColor: '#111', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#333', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { color: '#D4AF37', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  text: { color: '#ccc', marginBottom: 2 },
  roleText: { color: '#3498db', fontSize: 12, marginTop: 4, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'column', gap: 10 },
  btn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5, alignItems: 'center' },
  editBtn: { backgroundColor: '#3498db' },
  deleteBtn: { backgroundColor: '#e74c3c' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 20 },
  modalView: { backgroundColor: '#111', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#333' },
  modalTitle: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#444' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { backgroundColor: '#555', flex: 1, marginRight: 10 },
  saveBtn: { backgroundColor: '#D4AF37', flex: 1, marginLeft: 10 },
});

export default UsersScreen;
