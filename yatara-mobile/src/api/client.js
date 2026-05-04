import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 🚀 PRODUCTION: Replace with your Railway URL after deployment
// e.g. 'https://yatara-api-production.up.railway.app/api'
//
// 💻 LOCAL DEV OPTIONS:
//   - iOS Simulator:      'http://localhost:5001/api'
//   - Android Emulator:   'http://10.0.2.2:5001/api'
//   - Physical device:    'http://192.168.1.X:5001/api'  (your Mac's LAN IP)
const API_URL = 'https://YOUR-APP.up.railway.app/api';

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
