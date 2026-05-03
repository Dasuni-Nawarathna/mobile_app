import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import client from '../api/client';

const FinanceScreen = () => {
  const [activeTab, setActiveTab] = useState('INVOICES'); // 'INVOICES' or 'PAYMENTS'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
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
      setData(response.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', `Failed to fetch ${activeTab.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (activeTab === 'INVOICES') {
        const payload = {
          invoiceNo: invoiceNo || `INV-${Date.now()}`,
          totalAmount: Number(invoiceAmount),
          status: 'DRAFT',
          lineItems: [{ description: 'General Services', amount: Number(invoiceAmount) }]
        };
        
        if (editingId) {
          await client.patch(`/finance/invoices/${editingId}`, payload);
        } else {
          await client.post('/finance/invoices', payload);
        }
      } else {
        // Payments
        const payload = {
          amount: Number(paymentAmount),
          paymentMethod,
          type: 'PAYMENT',
          status: 'COMPLETED'
        };
        await client.post('/finance/payments', payload);
        // Note: we don't edit payments usually, just create
      }
      
      setModalVisible(false);
      resetForm();
      fetchData();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', `Failed to save ${activeTab === 'INVOICES' ? 'invoice' : 'payment'}`);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    if (activeTab === 'INVOICES') {
      setInvoiceNo(item.invoiceNo);
      setInvoiceAmount(item.totalAmount?.toString() || '');
    }
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setInvoiceNo('');
    setInvoiceAmount('');
    setPaymentAmount('');
    setPaymentMethod('ONLINE');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {activeTab === 'INVOICES' ? (
          <>
            <Text style={styles.cardTitle}>{item.invoiceNo}</Text>
            <Text style={styles.text}>Amount: LKR {item.totalAmount}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>Payment - {item.paymentMethod}</Text>
            <Text style={styles.text}>Amount: LKR {item.amount}</Text>
            <Text style={styles.text}>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
          </>
        )}
      </View>
      {activeTab === 'INVOICES' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.btn, styles.editBtn]} onPress={() => openEditModal(item)}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finance (Mod 5&6)</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'INVOICES' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('INVOICES')}
        >
          <Text style={[styles.tabText, activeTab === 'INVOICES' && styles.activeTabText]}>Invoices</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'PAYMENTS' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('PAYMENTS')}
        >
          <Text style={[styles.tabText, activeTab === 'PAYMENTS' && styles.activeTabText]}>Payments</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={openCreateModal}>
        <Text style={styles.addBtnText}>+ Create {activeTab === 'INVOICES' ? 'Invoice' : 'Payment'}</Text>
      </TouchableOpacity>
      
      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{color: '#fff', marginTop: 20}}>No records found.</Text>}
        />
      )}

      {/* CRUD Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingId ? `Edit ${activeTab === 'INVOICES' ? 'Invoice' : 'Payment'}` : `New ${activeTab === 'INVOICES' ? 'Invoice' : 'Payment'}`}
            </Text>
            
            {activeTab === 'INVOICES' ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Invoice Number (Auto if blank)"
                  placeholderTextColor="#888"
                  value={invoiceNo}
                  onChangeText={setInvoiceNo}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Total Amount (LKR) *"
                  placeholderTextColor="#888"
                  value={invoiceAmount}
                  onChangeText={setInvoiceAmount}
                  keyboardType="numeric"
                />
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Payment Amount (LKR) *"
                  placeholderTextColor="#888"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Method (CASH, ONLINE, BANK)"
                  placeholderTextColor="#888"
                  value={paymentMethod}
                  onChangeText={setPaymentMethod}
                  autoCapitalize="characters"
                />
              </>
            )}

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
  title: { fontSize: 24, fontWeight: 'bold', color: '#D4AF37', marginTop: 30, marginBottom: 15 },
  tabContainer: { flexDirection: 'row', marginBottom: 15, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#333' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#111' },
  activeTabBtn: { backgroundColor: '#D4AF37' },
  tabText: { color: '#888', fontWeight: 'bold' },
  activeTabText: { color: '#060D0B' },
  addBtn: { backgroundColor: '#2ecc71', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#111', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#333', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { color: '#D4AF37', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  text: { color: '#ccc', marginBottom: 2 },
  actionButtons: { flexDirection: 'column' },
  btn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5, alignItems: 'center' },
  editBtn: { backgroundColor: '#3498db' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 20 },
  modalView: { backgroundColor: '#111', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#333' },
  modalTitle: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#444' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { backgroundColor: '#555', flex: 1, marginRight: 10 },
  saveBtn: { backgroundColor: '#D4AF37', flex: 1, marginLeft: 10 },
});

export default FinanceScreen;
