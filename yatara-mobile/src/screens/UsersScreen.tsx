import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TouchableOpacity, Modal, TextInput, Alert, RefreshControl, ListRenderItem
} from 'react-native';
import client from '../api/client';
import { User } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const UsersScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await client.get('/users');
      setUsers(response.data?.users || response.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await client.patch(`/users/${editingId}`, { name, phone });
        Alert.alert('Success', 'User profile updated');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (e) {
      Alert.alert('Error', 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
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
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  const openEditModal = (user: User) => {
    setEditingId(user._id);
    setName(user.name || '');
    setPhone(user.phone || '');
    setModalVisible(true);
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleIcon = (role: string): IconName => {
    switch (role) {
      case 'ADMIN': return 'shield-check';
      case 'DRIVER': return 'car-steering-wheel';
      case 'HOTEL_MANAGER': return 'office-building';
      default: return 'account';
    }
  };

  const renderItem: ListRenderItem<User> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name={getRoleIcon(item.role)} size={24} color="#D4AF37" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{item.role}</Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
          <MaterialCommunityIcons name="account-edit-outline" size={18} color="#D4AF37" />
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item._id)}>
          <MaterialCommunityIcons name="account-remove-outline" size={18} color="#e74c3c" />
          <Text style={[styles.actionBtnText, { color: '#e74c3c' }]}>Deactivate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>User Accounts</Text>
          <Text style={styles.headerSub}>Manage the Yatara community</Text>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color="rgba(255,255,255,0.3)" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-search-outline" size={60} color="rgba(255,255,255,0.1)" />
              <Text style={styles.emptyText}>No users found.</Text>
            </View>
          }
        />
      )}

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>FULL NAME *</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#555"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
              <TextInput
                style={styles.input}
                placeholder="+94 7X XXX XXXX"
                placeholderTextColor="#555"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Update User</Text>
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
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.15)'
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#D4AF37' },
  headerSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  
  searchWrapper: { padding: 16 },
  searchBox: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0E1E16', 
    borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: '#1E3320' 
  },
  searchInput: { flex: 1, paddingVertical: 12, color: '#fff', fontSize: 14, marginLeft: 8 },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: { 
    backgroundColor: '#0E1E16', borderRadius: 16, padding: 16, marginBottom: 12, 
    borderWidth: 1, borderColor: '#1E3320' 
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { 
    width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(212,175,55,0.05)', 
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(212,175,55,0.1)' 
  },
  userName: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  userEmail: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  
  roleBadge: { backgroundColor: 'rgba(212,175,55,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  roleText: { color: '#D4AF37', fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 },

  cardActions: { 
    marginTop: 16, flexDirection: 'row', gap: 12, borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 14 
  },
  actionBtn: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    backgroundColor: 'rgba(212,175,55,0.05)', paddingVertical: 10, borderRadius: 10, gap: 8 
  },
  deleteBtn: { backgroundColor: 'rgba(231,76,60,0.05)' },
  actionBtnText: { color: '#D4AF37', fontSize: 12, fontWeight: 'bold' },

  emptyState: { alignItems: 'center', marginTop: 80 },
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
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  cancelBtn: { 
    flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' 
  },
  cancelBtnText: { color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' },
  saveBtn: { flex: 1, backgroundColor: '#D4AF37', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#060D0B', fontWeight: 'bold' },
});

export default UsersScreen;
