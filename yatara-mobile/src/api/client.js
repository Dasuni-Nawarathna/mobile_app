import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// For local dev with Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, localhost works
// If using Expo Go on a physical device, you need the local IP address of your machine, e.g. 192.168.1.X
// Using port 5001 to guarantee we hit our REAL database API, not the mocked one!
const API_URL = 'http://172.20.10.8:5001/api';

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
