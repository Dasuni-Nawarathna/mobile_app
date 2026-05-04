import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Image
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen: React.FC = () => {
  const { user, logout, updateUserInSession } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      if (!user?._id) return;
      const res = await client.patch(`/users/${user._id}`, { name, phone });
      updateUserInSession({ name: res.data.name, phone: res.data.phone });
      setEditing(false);
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* TOP HEADER */}
        <LinearGradient colors={['#1E3320', '#060D0B']} style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialCommunityIcons name="cog-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileMain}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: `https://ui-avatars.com/api/?name=${user?.name}&background=D4AF37&color=060D0B&bold=true&size=128` }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarBtn}>
                <MaterialCommunityIcons name="camera" size={16} color="#060D0B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.nameText}>{user?.name}</Text>
            <Text style={styles.emailText}>{user?.email}</Text>
            
            <View style={styles.badgeRow}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{user?.role}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>VERIFIED MEMBER</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* STATS STRIP */}
          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Gold</Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>

          {/* FORM CARD */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <TouchableOpacity onPress={() => setEditing(!editing)}>
                <Text style={styles.editLink}>{editing ? 'Cancel' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>FULL NAME</Text>
              {editing ? (
                <TextInput 
                  style={styles.input} 
                  value={name} 
                  onChangeText={setName} 
                  placeholderTextColor="#555" 
                />
              ) : (
                <Text style={styles.fieldValue}>{user?.name}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
              {editing ? (
                <TextInput 
                  style={styles.input} 
                  value={phone} 
                  onChangeText={setPhone} 
                  keyboardType="phone-pad" 
                  placeholderTextColor="#555" 
                />
              ) : (
                <Text style={styles.fieldValue}>{user?.phone || 'Not provided'}</Text>
              )}
            </View>

            {editing && (
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={saving}>
                {saving ? <ActivityIndicator color="#060D0B" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
            )}
          </View>

          {/* MENU ITEMS */}
          <View style={styles.menuBox}>
            {([
              { icon: 'shield-lock-outline' as IconName, label: 'Security & Password' },
              { icon: 'credit-card-outline' as IconName, label: 'Payment Methods' },
              { icon: 'bell-ring-outline' as IconName, label: 'Notifications' },
              { icon: 'help-circle-outline' as IconName, label: 'Support & Help' },
            ]).map((item, idx) => (
              <TouchableOpacity 
                key={item.label} 
                style={[styles.menuItem, idx !== 3 && styles.menuDivider]}
              >
                <View style={styles.menuIconBox}>
                  <MaterialCommunityIcons name={item.icon} size={20} color="#D4AF37" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <MaterialCommunityIcons name="power" size={20} color="#e74c3c" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060D0B' },
  
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  
  profileMain: { alignItems: 'center', marginTop: 10 },
  avatarWrapper: { marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#D4AF37' },
  editAvatarBtn: { 
    position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, 
    borderRadius: 16, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#1E3320'
  },
  nameText: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  emailText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 16 },
  
  badgeRow: { flexDirection: 'row', gap: 10 },
  roleBadge: { backgroundColor: 'rgba(212,175,55,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)' },
  roleBadgeText: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  statusBadge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusBadgeText: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: 'bold' },

  content: { padding: 20, marginTop: -30 },
  
  statsStrip: { 
    flexDirection: 'row', backgroundColor: '#0E1E16', borderRadius: 24, padding: 20, 
    borderWidth: 1, borderColor: '#1E3320', marginBottom: 24, elevation: 10, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.05)' },

  card: { backgroundColor: '#0E1E16', borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#1E3320' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  editLink: { color: '#D4AF37', fontSize: 13, fontWeight: '600' },
  
  field: { marginBottom: 20 },
  fieldLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  fieldValue: { color: '#ddd', fontSize: 15 },
  input: { backgroundColor: '#060D0B', color: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#1E3320', fontSize: 14 },
  
  saveBtn: { backgroundColor: '#D4AF37', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#060D0B', fontWeight: 'bold', fontSize: 14 },

  menuBox: { backgroundColor: '#0E1E16', borderRadius: 24, padding: 8, borderWidth: 1, borderColor: '#1E3320', marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(212,175,55,0.05)', alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '600' },

  logoutBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, 
    paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(231,76,96,0.2)', backgroundColor: 'rgba(231,76,96,0.05)' 
  },
  logoutText: { color: '#e74c3c', fontWeight: 'bold', fontSize: 14 },
});

export default ProfileScreen;
