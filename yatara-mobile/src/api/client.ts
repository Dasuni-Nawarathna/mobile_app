import axios, { InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Change this to your local machine IP (e.g., '192.168.1.5') to test against local backend
const LOCAL_IP = 'localhost'; 
const API_URL = __DEV__ 
  ? `http://${LOCAL_IP}:5001/api` 
  : 'https://mobileapp-production-cb35.up.railway.app/api';

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
