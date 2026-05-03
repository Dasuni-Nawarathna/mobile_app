import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import client from '../api/client';

const BookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [totalCost, setTotalCost] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await client.get('/bookings');
      setBookings(response.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!customerName || !totalCost) {
      Alert.alert('Validation Error', 'Please fill required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerName,
        email: customerEmail || 'test@example.com',
        totalCost: Number(totalCost),
        bookingNo: editingId ? undefined : `BKG-${Date.now()}`,
        status: 'NEW',
        type: 'PACKAGE'
      };

      if (editingId) {
        await client.patch(`/bookings/${editingId}`, payload);
        Alert.alert('Success', 'Booking updated');
      } else {
        await client.post('/bookings', payload);
        Alert.alert('Success', 'Booking created');
      }
      
      setModalVisible(false);
      resetForm();
      fetchBookings();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save booking');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm Cancel', 'Are you sure you want to cancel/delete this booking?', [
      { text: 'No', style: 'cancel' },
      { 
        text: 'Yes', 
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await client.delete(`/bookings/${id}`);
            fetchBookings();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete booking');
            setLoading(false);
          }
        }
      }
    ]);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (booking) => {
    setEditingId(booking._id);
    setCustomerName(booking.customerName);
    setCustomerEmail(booking.email);
    setTotalCost(booking.totalCost?.toString() || '');
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setCustomerName('');
    setCustomerEmail('');
    setTotalCost('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.bookingNo}>{item.bookingNo}</Text>
        <Text style={styles.text}>Customer: {item.customerName}</Text>
        <Text style={styles.statusText}>Status: {item.status}</Text>
        <Text style={styles.text}>Total: LKR {item.totalCost}</Text>
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
      <View style={styles.header}>
        <Text style={styles.title}>Bookings (Mod 4)</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openCreateModal}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{color: '#fff'}}>No bookings found.</Text>}
        />
      )}

      {/* CRUD Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Booking' : 'New Booking'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Customer Name *"
              placeholderTextColor="#888"
              value={customerName}
              onChangeText={setCustomerName}
            />
            <TextInput
              style={styles.input}
              placeholder="Customer Email"
              placeholderTextColor="#888"
              value={customerEmail}
              onChangeText={setCustomerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Total Cost (LKR) *"
              placeholderTextColor="#888"
              value={totalCost}
              onChangeText={setTotalCost}
              keyboardType="numeric"
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#D4AF37' },
  addBtn: { backgroundColor: '#D4AF37', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#060D0B', fontWeight: 'bold' },
  card: { backgroundColor: '#111', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#333', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardContent: { flex: 1 },
  bookingNo: { color: '#D4AF37', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  text: { color: '#ccc', marginBottom: 2 },
  statusText: { color: '#f39c12', fontSize: 12, marginTop: 4, marginBottom: 4 },
  actionButtons: { flexDirection: 'column', gap: 10 },
  btn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5, alignItems: 'center' },
  editBtn: { backgroundColor: '#3498db' },
  deleteBtn: { backgroundColor: '#e74c3c' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 20 },
  modalView: { backgroundColor: '#111', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#333' },
  modalTitle: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#444' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { backgroundColor: '#555', flex: 1, marginRight: 10, paddingVertical: 12 },
  saveBtn: { backgroundColor: '#D4AF37', flex: 1, marginLeft: 10, paddingVertical: 12 },
});

export default BookingsScreen;
