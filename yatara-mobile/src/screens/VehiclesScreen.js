import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import client from '../api/client';

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('CAR');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await client.get('/vehicles');
      setVehicles(response.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!make || !model || !plateNumber) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        make,
        model,
        plateNumber,
        type: vehicleType,
        seats: 4, // Default for mobile demo
        status: 'AVAILABLE'
      };

      if (editingId) {
        await client.patch(`/vehicles/${editingId}`, payload);
        Alert.alert('Success', 'Vehicle updated successfully');
      } else {
        await client.post('/vehicles', payload);
        Alert.alert('Success', 'Vehicle added successfully');
      }
      
      setModalVisible(false);
      resetForm();
      fetchVehicles();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save vehicle');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this vehicle?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await client.delete(`/vehicles/${id}`);
            fetchVehicles();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete vehicle');
            setLoading(false);
          }
        }
      }
    ]);
  };

  const openEditModal = (vehicle) => {
    setEditingId(vehicle._id);
    setMake(vehicle.make);
    setModel(vehicle.model);
    setPlateNumber(vehicle.plateNumber);
    setVehicleType(vehicle.type || 'CAR');
    setModalVisible(true);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setMake('');
    setModel('');
    setPlateNumber('');
    setVehicleType('CAR');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.make} {item.model}</Text>
        <Text style={styles.text}>Plate: {item.plateNumber} • Type: {item.type}</Text>
        <Text style={styles.statusText}>Status: {item.status}</Text>
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
        <Text style={styles.title}>Fleet (Module 3)</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openCreateModal}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{color: '#fff'}}>No vehicles found.</Text>}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Vehicle' : 'Add Vehicle'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Make (e.g. Toyota) *"
              placeholderTextColor="#888"
              value={make}
              onChangeText={setMake}
            />
            <TextInput
              style={styles.input}
              placeholder="Model (e.g. Prius) *"
              placeholderTextColor="#888"
              value={model}
              onChangeText={setModel}
            />
            <TextInput
              style={styles.input}
              placeholder="Plate Number *"
              placeholderTextColor="#888"
              value={plateNumber}
              onChangeText={setPlateNumber}
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
  cardTitle: { color: '#D4AF37', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  text: { color: '#ccc', marginBottom: 2 },
  statusText: { color: '#2ecc71', fontSize: 12, marginTop: 4 },
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

export default VehiclesScreen;
