import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
  ActivityIndicator, Alert, Modal, TextInput, RefreshControl, ListRenderItem
} from 'react-native';
import { AuthContext, User } from '../context/AuthContext';
import client from '../api/client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#27ae60',
  PENDING_APPROVAL: '#f39c12',
  REJECTED: '#e74c3c',
  DISABLED: '#888',
};

const ROLE_ICONS: Record<string, IconName> = {
  ADMIN: 'shield-key', STAFF: 'account-tie', TOURIST: 'earth', DRIVER: 'car',
  HOTEL_MANAGER: 'office-building', VEHICLE_OWNER: 'bus', HOTEL_OWNER: 'office-building', USER: 'account',
};

const ALL_ROLES = ['TOURIST', 'DRIVER', 'HOTEL_MANAGER', 'STAFF', 'ADMIN'];
const ALL_STATUSES = ['ACTIVE', 'PENDING_APPROVAL', 'REJECTED', 'DISABLED'];

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const AdminControlPanel: React.FC<Props> = ({ navigation }) => {
  const { user: adminUser, logout } = useContext(AuthContext);

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchText, setSearchText] = useState('');

  // Create user modal
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('admin123');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('TOURIST');
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [creating, setCreating] = useState(false);

  // Active tab: 'users' | 'pending'
  const [activeTab, setActiveTab] = useState<'users' | 'pending'>('pending');

  useEffect(() => {
    fetchUsers();
  }, [filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (filterRole) params.append('role', filterRole);
      if (filterStatus) params.append('status', filterStatus);

      const res = await client.get(`/users?${params.toString()}`);
      const data = res.data;
      const all: User[] = data.users || data || [];
      setUsers(all);
      setTotal(data.total || all.length);
      setPendingCount(all.filter((u) => u.status === 'PENDING_APPROVAL').length);
    } catch (e) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleApprove = async (id: string, name: string) => {
    Alert.alert('Approve User', `Approve ${name} as an active provider?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve', style: 'default', onPress: async () => {
          try {
            await client.patch(`/users/${id}/approve`);
            fetchUsers();
          } catch (e) {
            Alert.alert('Error', 'Could not approve user');
          }
        },
      },
    ]);
  };

  const handleReject = async (id: string, name: string) => {
    Alert.alert('Reject User', `Reject ${name}'s account?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject', style: 'destructive', onPress: async () => {
          try {
            await client.patch(`/users/${id}/reject`);
            fetchUsers();
          } catch (e) {
            Alert.alert('Error', 'Could not reject user');
          }
        },
      },
    ]);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Deactivate Account', `Are you sure you want to remove ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive', onPress: async () => {
          try {
            await client.delete(`/users/${id}`);
            fetchUsers();
          } catch (e) {
            Alert.alert('Error', 'Could not remove user');
          }
        },
      },
    ]);
  };

  const handleCreate = async () => {
    if (!newName || !newEmail || !newPassword) {
      Alert.alert('Validation', 'Name, email, and password are required.');
      return;
    }
    setCreating(true);
    try {
      await client.post('/users', {
        name: newName, email: newEmail, password: newPassword,
        phone: newPhone, role: newRole, status: newStatus,
      });
      setCreateModalVisible(false);
      setNewName(''); setNewEmail(''); setNewPhone(''); setNewPassword('admin123');
      setNewRole('TOURIST'); setNewStatus('ACTIVE');
      fetchUsers();
      Alert.alert('Created', `Demo account for ${newName} has been created.`);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'Could not create user');
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const displayUsers = activeTab === 'pending'
    ? filteredUsers.filter((u) => u.status === 'PENDING_APPROVAL')
    : filteredUsers;

  const renderUserCard: ListRenderItem<User> = ({ item: u }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          <MaterialCommunityIcons name={ROLE_ICONS[u.role] || 'account'} size={24} color="#D4AF37" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{u.name}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>{u.email}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.roleBadge, { backgroundColor: '#1a2820' }]}>
              <Text style={styles.roleText}>{u.role}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[u.status] || '#888') + '22' }]}>
              <Text style={[styles.statusText, { color: STATUS_COLORS[u.status] || '#888' }]}>
                {u.status?.replace('_', ' ')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        {u.status === 'PENDING_APPROVAL' && (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn]}
              onPress={() => handleApprove(u._id, u.name)}
            >
              <Text style={styles.actionBtnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleReject(u._id, u.name)}
            >
              <Text style={styles.actionBtnText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
        {u.status === 'ACTIVE' && u.role !== 'ADMIN' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDelete(u._id, u.name)}
          >
            <Text style={styles.actionBtnText}>Remove Account</Text>
          </TouchableOpacity>
        )}
        {u.status === 'REJECTED' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={() => handleApprove(u._id, u.name)}
          >
            <Text style={styles.actionBtnText}>Re-Approve</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── Header ─────────────────────────────── */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <MaterialCommunityIcons name="shield-key" size={26} color="#D4AF37" />
          <View>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSub}>Yatara Ceylon Control Centre</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* ── KPI Row ───────────────────────────── */}
      <View style={styles.kpiRow}>
        {[
          { label: 'Total Users', value: total, icon: 'account-group' as IconName },
          { label: 'Pending Review', value: pendingCount, icon: 'clock-alert-outline' as IconName, highlight: pendingCount > 0 },
          { label: 'Active', value: users.filter((u) => u.status === 'ACTIVE').length, icon: 'account-check' as IconName },
        ].map((kpi) => (
          <View key={kpi.label} style={[styles.kpiCard, kpi.highlight && styles.kpiCardHighlight]}>
            <MaterialCommunityIcons name={kpi.icon} size={22} color={kpi.highlight ? '#FFC107' : '#D4AF37'} style={{ marginBottom: 4 }} />
            <Text style={[styles.kpiValue, kpi.highlight && { color: '#FFC107' }]}>{kpi.value}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Create Demo Button ─────────────────── */}
      <TouchableOpacity style={styles.createBtn} onPress={() => setCreateModalVisible(true)}>
        <Text style={styles.createBtnText}>+ Create Demo Account</Text>
      </TouchableOpacity>

      {/* ── Tabs ─────────────────────────────── */}
      <View style={styles.tabRow}>
        {(['pending', 'users'] as const).map((key) => {
          const labels = { pending: `Pending (${pendingCount})`, users: 'All Users' };
          const icons: Record<string, IconName> = { pending: 'clock-outline', users: 'account-group' };
          return (
            <TouchableOpacity
              key={key}
              style={[styles.tab, activeTab === key && styles.tabActive]}
              onPress={() => setActiveTab(key)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name={icons[key]} size={16} color={activeTab === key ? '#D4AF37' : 'rgba(255,255,255,0.4)'} />
                <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>
                  {labels[key]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Search ───────────────────────────── */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color="rgba(255,255,255,0.25)" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* ── User List ─────────────────────────── */}
      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={displayUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderUserCard}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name={activeTab === 'pending' ? 'party-popper' : 'account-off'} size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>
                {activeTab === 'pending' ? 'All caught up!' : 'No users found'}
              </Text>
              <Text style={styles.emptyText}>
                {activeTab === 'pending'
                  ? 'No accounts are pending approval.'
                  : 'Try adjusting your search.'}
              </Text>
            </View>
          }
        />
      )}

      {/* ── Create Demo Modal ─────────────────── */}
      <Modal visible={createModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Create Demo Account</Text>

            {[
              { label: 'Full Name *', value: newName, setter: setNewName, placeholder: 'e.g. Emma Tourist' },
              { label: 'Email *', value: newEmail, setter: setNewEmail, placeholder: 'emma@example.com', autoCapitalize: 'none' as const, keyboardType: 'email-address' as const },
              { label: 'Password *', value: newPassword, setter: setNewPassword, placeholder: 'admin123' },
              { label: 'Phone', value: newPhone, setter: setNewPhone, placeholder: '+94 7X XXX XXXX', keyboardType: 'phone-pad' as const },
            ].map((field) => (
              <View key={field.label} style={{ marginBottom: 12 }}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder={field.placeholder}
                  placeholderTextColor="#555"
                  value={field.value}
                  onChangeText={field.setter}
                  autoCapitalize={field.autoCapitalize || 'words'}
                  keyboardType={field.keyboardType || 'default'}
                />
              </View>
            ))}

            <Text style={styles.fieldLabel}>Role</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {ALL_ROLES.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.rolePill, newRole === r && styles.rolePillActive]}
                    onPress={() => setNewRole(r)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <MaterialCommunityIcons name={ROLE_ICONS[r]} size={14} color={newRole === r ? '#D4AF37' : '#888'} />
                      <Text style={[styles.rolePillText, newRole === r && styles.rolePillTextActive]}>
                        {r}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={styles.fieldLabel}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {ALL_STATUSES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.rolePill, newStatus === s && styles.rolePillActive]}
                    onPress={() => setNewStatus(s)}
                  >
                    <Text style={[styles.rolePillText, newStatus === s && styles.rolePillTextActive]}>
                      {s.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setCreateModalVisible(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleCreate} disabled={creating}>
                {creating ? <ActivityIndicator color="#060D0B" /> : <Text style={styles.modalBtnText}>Create Account</Text>}
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.15)',
  },
  headerTitle: { color: '#D4AF37', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  logoutBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  logoutText: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },

  kpiRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, gap: 10 },
  kpiCard: {
    flex: 1, backgroundColor: '#0E1E16', borderRadius: 14, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#1E3320',
  },
  kpiCardHighlight: { borderColor: 'rgba(255,193,7,0.4)', backgroundColor: 'rgba(255,193,7,0.06)' },
  kpiValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  kpiLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 9, textAlign: 'center', letterSpacing: 0.5 },

  createBtn: {
    marginHorizontal: 16, marginBottom: 8, paddingVertical: 12, borderRadius: 12,
    backgroundColor: 'rgba(212,175,55,0.12)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)', alignItems: 'center',
  },
  createBtnText: { color: '#D4AF37', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 },

  tabRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 10, gap: 10 },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center',
  },
  tabActive: { borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)' },
  tabText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#D4AF37' },

  searchContainer: { marginHorizontal: 16, marginBottom: 10 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 14,
  },
  searchInput: { flex: 1, paddingVertical: 10, color: '#fff', fontSize: 13 },

  userCard: {
    backgroundColor: '#0E1E16', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#1E3320',
  },
  userHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  userAvatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#1a2820',
    alignItems: 'center', justifyContent: 'center',
  },
  userInfo: { flex: 1 },
  userName: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 2 },
  userEmail: { color: 'rgba(255,255,255,0.45)', fontSize: 12, marginBottom: 6 },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  roleText: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  actionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', minWidth: 80 },
  approveBtn: { backgroundColor: 'rgba(39,174,96,0.15)', borderWidth: 1, borderColor: 'rgba(39,174,96,0.4)' },
  rejectBtn: { backgroundColor: 'rgba(231,76,60,0.12)', borderWidth: 1, borderColor: 'rgba(231,76,60,0.3)' },
  deleteBtn: { backgroundColor: 'rgba(231,76,60,0.08)', borderWidth: 1, borderColor: 'rgba(231,76,60,0.2)' },
  actionBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { color: '#D4AF37', fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  emptyText: { color: 'rgba(255,255,255,0.35)', fontSize: 13, textAlign: 'center' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.85)' },
  modalView: {
    backgroundColor: '#0E1E16', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)', maxHeight: '92%',
  },
  modalTitle: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  fieldLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 6 },
  modalInput: {
    backgroundColor: '#111', color: '#fff', padding: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#333', fontSize: 13,
  },
  rolePill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  rolePillActive: { borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)' },
  rolePillText: { color: '#888', fontSize: 11, fontWeight: 'bold' },
  rolePillTextActive: { color: '#D4AF37' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  modalBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#1a2820', borderWidth: 1, borderColor: '#333' },
  saveBtn: { backgroundColor: '#D4AF37' },
  modalBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});

export default AdminControlPanel;
