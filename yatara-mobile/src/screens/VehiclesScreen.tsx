import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TouchableOpacity, Modal, TextInput, Alert, RefreshControl, ListRenderItem, Image
} from 'react-native';
import client from '../api/client';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  plateNumber: string;
  type: string;
  status: string;
  seats?: number;
}

const VehiclesScreen: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
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
      setVehicles(response.data?.vehicles || response.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
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
        seats: 4,
        status: 'AVAILABLE'
      };

      if (editingId) {
        await client.patch(`/vehicles/${editingId}`, payload);
        Alert.alert('Success', 'Vehicle updated successfully');
      } else {
        await client.post('/vehicles', payload);
        Alert.alert('Success', 'Vehicle added to fleet');
      }
      
      setModalVisible(false);
      resetForm();
      fetchVehicles();
    } catch (e) {
      Alert.alert('Error', 'Failed to save vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Remove', 'Are you sure you want to remove this vehicle from your fleet?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Remove', 
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await client.delete(`/vehicles/${id}`);
            fetchVehicles();
          } catch (e) {
            Alert.alert('Error', 'Failed to remove vehicle');
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  const resetForm = () => {
    setEditingId(null);
    setMake('');
    setModel('');
    setPlateNumber('');
    setVehicleType('CAR');
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingId(vehicle._id);
    setMake(vehicle.make || '');
    setModel(vehicle.model || '');
    setPlateNumber(vehicle.plateNumber || '');
    setVehicleType(vehicle.type || 'CAR');
    setModalVisible(true);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const renderItem: ListRenderItem<Vehicle> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.vehicleIconContainer}>
          <MaterialCommunityIcons 
            name={item.type === 'VAN' ? 'bus' : 'car'} 
            size={32} 
            color="#D4AF37" 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.vehicleTitle}>{item.make} {item.model}</Text>
          <Text style={styles.plateText}>{item.plateNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'AVAILABLE' ? '#27ae6022' : '#f39c1222' }]}>
          <Text style={[styles.statusText, { color: item.status === 'AVAILABLE' ? '#27ae60' : '#f39c12' }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
          <MaterialCommunityIcons name="pencil-outline" size={16} color="#D4AF37" />
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item._id)}>
          <MaterialCommunityIcons name="trash-can-outline" size={16} color="#e74c3c" />
          <Text style={[styles.actionBtnText, { color: '#e74c3c' }]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={{ width: 44, height: 44 }}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.addBtn} onPress={openCreateModal}>
          <MaterialCommunityIcons name="plus" size={20} color="#060D0B" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="car-off" size={60} color="rgba(255,255,255,0.1)" />
              <Text style={styles.emptyText}>No vehicles in your fleet yet.</Text>
            </View>
          }
        />
      )}

      {/* CRUD Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</Text>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>MAKE *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Toyota"
                  placeholderTextColor="#555"
                  value={make}
                  onChangeText={setMake}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>MODEL *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Prius"
                  placeholderTextColor="#555"
                  value={model}
                  onChangeText={setModel}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>PLATE NUMBER *</Text>
              <TextInput
                style={styles.input}
                placeholder="WP ABC-1234"
                placeholderTextColor="#555"
                value={plateNumber}
                onChangeText={setPlateNumber}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>VEHICLE TYPE</Text>
              <View style={styles.typeRow}>
                {['CAR', 'VAN', 'SUV'].map((type) => (
                  <TouchableOpacity 
                    key={type}
                    style={[styles.typeBtn, vehicleType === type && styles.typeBtnActive]}
                    onPress={() => setVehicleType(type)}
                  >
                    <Text style={[styles.typeBtnText, vehicleType === type && styles.typeBtnTextActive]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>{editingId ? 'Update' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060D0B' },
  
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.15)'
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#D4AF37' },
  headerSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  
  addBtn: { 
    backgroundColor: '#D4AF37', flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 4
  },
  addBtnText: { color: '#060D0B', fontWeight: 'bold', fontSize: 14 },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: { 
    backgroundColor: '#0E1E16', borderRadius: 16, padding: 16, marginBottom: 16, 
    borderWidth: 1, borderColor: '#1E3320' 
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  vehicleIconContainer: { 
    width: 50, height: 50, borderRadius: 12, backgroundColor: 'rgba(212,175,55,0.1)',
    alignItems: 'center', justifyContent: 'center'
  },
  vehicleTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 2 },
  plateText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: 1 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },

  cardActions: { 
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', 
    paddingTop: 14, gap: 12 
  },
  actionBtn: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    backgroundColor: 'rgba(212,175,55,0.05)', paddingVertical: 10, borderRadius: 10, gap: 8,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.1)'
  },
  deleteBtn: { backgroundColor: 'rgba(231,76,60,0.05)', borderColor: 'rgba(231,76,60,0.1)' },
  actionBtnText: { color: '#D4AF37', fontSize: 12, fontWeight: 'bold' },

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: 'rgba(255,255,255,0.2)', marginTop: 16, fontSize: 15 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.85)' },
  modalView: { 
    backgroundColor: '#0E1E16', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, 
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)' 
  },
  modalTitle: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold', marginBottom: 24 },
  field: { marginBottom: 16 },
  fieldLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  input: { 
    backgroundColor: '#060D0B', color: '#fff', padding: 14, borderRadius: 12, 
    borderWidth: 1, borderColor: '#1E3320', fontSize: 15 
  },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: { 
    flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, 
    borderColor: '#1E3320', alignItems: 'center', backgroundColor: '#060D0B' 
  },
  typeBtnActive: { borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)' },
  typeBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 'bold' },
  typeBtnTextActive: { color: '#D4AF37' },

  modalActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  cancelBtn: { 
    flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' 
  },
  cancelBtnText: { color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' },
  saveBtn: { flex: 1, backgroundColor: '#D4AF37', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#060D0B', fontWeight: 'bold' },
});

export default VehiclesScreen;
