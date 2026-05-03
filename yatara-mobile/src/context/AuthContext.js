import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await client.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      console.error(e);
      const errData = e.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || e.message || 'Login Failed');
      alert(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    setIsLoading(true);
    try {
      const response = await client.post('/auth/register', { name, email, password, phone });
      const { token, ...userData } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      console.error(e);
      const errData = e.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || e.message || 'Registration Failed');
      alert(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userData');
    setUser(null);
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await SecureStore.getItemAsync('userToken');
      let userDataStr = await SecureStore.getItemAsync('userData');
      
      if (userToken && userDataStr) {
        setUser(JSON.parse(userDataStr)); 
      }
    } catch (e) {
      console.log(`isLoggedIn in error ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, register, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
};
