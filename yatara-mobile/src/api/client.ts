import axios, { InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Change this to your local machine IP (e.g., '192.168.1.5') to test against local backend
const LOCAL_IP = '192.168.1.151'; 
const API_URL = 'https://mobileapp-production-cb35.up.railway.app/api';

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
