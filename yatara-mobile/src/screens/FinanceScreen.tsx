import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TouchableOpacity, Modal, TextInput, Alert, RefreshControl, ListRenderItem, Image
} from 'react-native';
import client from '../api/client';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FinanceItem {
  _id: string;
  invoiceNo?: string;
  paymentMethod?: string;
  status?: string;
  totalAmount?: number;
  amount?: number;
  createdAt: string | Date;
}

const FinanceScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INVOICES' | 'PAYMENTS'>('INVOICES');
  const [data, setData] = useState<FinanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Invoice Form Fields
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  
  // Payment Form Fields
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'INVOICES' ? '/finance/invoices' : '/finance/payments';
      const response = await client.get(endpoint);
      setData(response.data?.invoices || response.data?.payments || response.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSave = async () => {
    if (activeTab === 'INVOICES' && !invoiceAmount) {
      Alert.alert('Validation Error', 'Invoice amount is required.');
      return;
    }
    if (activeTab === 'PAYMENTS' && !paymentAmount) {
      Alert.alert('Validation Error', 'Payment amount is required.');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'INVOICES') {
        const payload = {
          invoiceNo: invoiceNo || `INV-${Date.now().toString().slice(-6)}`,
          totalAmount: Number(invoiceAmount),
          status: 'DRAFT',
          lineItems: [{ description: 'General Services', amount: Number(invoiceAmount) }]
        };
        
        if (editingId) {
          await client.patch(`/finance/invoices/${editingId}`, payload);
          Alert.alert('Success', 'Invoice updated');
        } else {
          await client.post('/finance/invoices', payload);
          Alert.alert('Success', 'Invoice created');
        }
      } else {
        const payload = {
          amount: Number(paymentAmount),
          paymentMethod,
          type: 'PAYMENT',
          status: 'COMPLETED'
        };
        await client.post('/finance/payments', payload);
        Alert.alert('Success', 'Payment record added');
      }
      
      setModalVisible(false);
      resetForm();
      fetchData();
    } catch (e) {
      Alert.alert('Error', 'Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setInvoiceNo('');
    setInvoiceAmount('');
    setPaymentAmount('');
    setPaymentMethod('ONLINE');
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (item: FinanceItem) => {
    setEditingId(item._id);
    if (activeTab === 'INVOICES') {
      setInvoiceNo(item.invoiceNo || '');
      setInvoiceAmount(item.totalAmount?.toString() || '');
    }
    setModalVisible(true);
  };

  const renderItem: ListRenderItem<FinanceItem> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name={activeTab === 'INVOICES' ? 'file-document-outline' : 'bank-transfer-in'} 
            size={24} 
            color="#D4AF37" 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>
            {activeTab === 'INVOICES' ? (item.invoiceNo || 'INV-XXXX') : `${item.paymentMethod} Payment`}
          </Text>
          <Text style={styles.cardSub}>
            {activeTab === 'INVOICES' ? `Status: ${item.status}` : new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.amountText}>LKR {(item.totalAmount || item.amount || 0).toLocaleString()}</Text>
      </View>
      
      {activeTab === 'INVOICES' && (
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
            <MaterialCommunityIcons name="pencil-outline" size={16} color="#D4AF37" />
            <Text style={styles.actionBtnText}>Edit Invoice</Text>
          </TouchableOpacity>
        </View>
      )}
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
          <Text style={styles.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabWrapper}>
        <View style={styles.tabContainer}>
          {(['INVOICES', 'PAYMENTS'] as const).map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]} 
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="cash-remove" size={60} color="rgba(255,255,255,0.1)" />
              <Text style={styles.emptyText}>No financial records found.</Text>
            </View>
          }
        />
      )}

      {/* CRUD Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Update Record' : `New ${activeTab === 'INVOICES' ? 'Invoice' : 'Payment'}`}
            </Text>
            
            {activeTab === 'INVOICES' ? (
              <>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>INVOICE NUMBER</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Auto-generated if left blank"
                    placeholderTextColor="#555"
                    value={invoiceNo}
                    onChangeText={setInvoiceNo}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>TOTAL AMOUNT (LKR) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#555"
                    value={invoiceAmount}
                    onChangeText={setInvoiceAmount}
                    keyboardType="numeric"
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>PAYMENT AMOUNT (LKR) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#555"
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>PAYMENT METHOD</Text>
                  <View style={styles.methodRow}>
                    {['CASH', 'ONLINE', 'BANK'].map((m) => (
                      <TouchableOpacity 
                        key={m}
                        style={[styles.methodBtn, paymentMethod === m && styles.methodBtnActive]}
                        onPress={() => setPaymentMethod(m)}
                      >
                        <Text style={[styles.methodBtnText, paymentMethod === m && styles.methodBtnTextActive]}>{m}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Record</Text>
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

  tabWrapper: { padding: 16, paddingBottom: 0 },
  tabContainer: { 
    flexDirection: 'row', backgroundColor: '#0E1E16', borderRadius: 12, 
    padding: 4, borderWidth: 1, borderColor: '#1E3320' 
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTabBtn: { backgroundColor: '#1E3320' },
  tabText: { color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontSize: 13 },
  activeTabText: { color: '#D4AF37' },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: { 
    backgroundColor: '#0E1E16', borderRadius: 16, padding: 16, marginBottom: 12, 
    borderWidth: 1, borderColor: '#1E3320' 
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { 
    width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(212,175,55,0.05)', 
    alignItems: 'center', justifyContent: 'center' 
  },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  amountText: { color: '#D4AF37', fontSize: 16, fontWeight: 'bold' },

  cardActions: { 
    marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', 
    paddingTop: 12 
  },
  actionBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    backgroundColor: 'rgba(212,175,55,0.05)', paddingVertical: 10, borderRadius: 10, gap: 8 
  },
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
  methodRow: { flexDirection: 'row', gap: 10 },
  methodBtn: { 
    flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, 
    borderColor: '#1E3320', alignItems: 'center', backgroundColor: '#060D0B' 
  },
  methodBtnActive: { borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)' },
  methodBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 'bold' },
  methodBtnTextActive: { color: '#D4AF37' },

  modalActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  cancelBtn: { 
    flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' 
  },
  cancelBtnText: { color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' },
  saveBtn: { flex: 1, backgroundColor: '#D4AF37', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#060D0B', fontWeight: 'bold' },
});

export default FinanceScreen;
