import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import client from '../api/client';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  bootChecked: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, phone: string, role?: string) => Promise<void>;
  updateUserInSession: (updatedFields: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Role classification helpers
export const isTourist = (role: string) => ['TOURIST', 'USER'].includes(role);
export const isServiceProvider = (role: string) => ['DRIVER', 'HOTEL_MANAGER', 'VEHICLE_OWNER', 'HOTEL_OWNER'].includes(role);
export const isAdmin = (role: string) => role === 'ADMIN';
export const isStaff = (role: string) => role === 'STAFF';
export const isAdminOrStaff = (role: string) => ['ADMIN', 'STAFF'].includes(role);
export const isPending = (status: string) => status === 'PENDING_APPROVAL';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bootChecked, setBootChecked] = useState(false);

  const persistSession = async (token: string, userData: User) => {
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    console.log('[Auth] Attempting login for:', email);
    setIsLoading(true);
    try {
      const response = await client.post('/auth/login', { email, password });
      console.log('[Auth] Login success:', response.data.email, 'Role:', response.data.role);
      const { token, ...userData } = response.data;
      await persistSession(token, userData);
    } catch (e: any) {
      console.error('[Auth] Login error:', e.response?.data || e.message);
      let errMsg = e.response?.data?.error || e.message || 'Login failed.';
      
      if (errMsg.includes('TOURIST') && errMsg.includes('enum')) {
        errMsg = "Production API Error: The 'TOURIST' role is not recognized by the server. Please redeploy the backend or use 'USER' role.";
      }

      Alert.alert('Sign In Failed', errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone: string, role = 'TOURIST') => {
    setIsLoading(true);
    try {
      const response = await client.post('/auth/register', { name, email, password, phone, role: role.trim() });
      const { token, ...userData } = response.data;
      await persistSession(token, userData);
    } catch (e: any) {
      const errMsg = e.response?.data?.error || e.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', errMsg);
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

  const updateUserInSession = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updatedFields };
      SecureStore.setItemAsync('userData', JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  // Restore session on boot
  useEffect(() => {
    const restoreSession = async () => {
      try {
        setIsLoading(true);
        const token = await SecureStore.getItemAsync('userToken');
        const userDataStr = await SecureStore.getItemAsync('userData');
        if (token && userDataStr) {
          setUser(JSON.parse(userDataStr));
        }
      } catch (e) {
        // Silent failure — user will just need to log in
      } finally {
        setIsLoading(false);
        setBootChecked(true);
      }
    };
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      bootChecked,
      login, 
      logout, 
      register,
      updateUserInSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
