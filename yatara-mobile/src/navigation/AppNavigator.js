import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import UsersScreen from '../screens/UsersScreen';
import PackagesScreen from '../screens/PackagesScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import BookingsScreen from '../screens/BookingsScreen';
import FinanceScreen from '../screens/FinanceScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PublicStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppTabs = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role || 'USER';

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#060D0B' },
        headerTintColor: '#D4AF37',
        tabBarStyle: { backgroundColor: '#060D0B', borderTopColor: '#333' },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      
      {(role === 'ADMIN' || role === 'STAFF') && (
        <Tab.Screen name="Users" component={UsersScreen} />
      )}
      
      {(role === 'ADMIN' || role === 'STAFF' || role === 'HOTEL_OWNER' || role === 'USER') && (
        <Tab.Screen name="Packages" component={PackagesScreen} />
      )}
      
      {(role === 'ADMIN' || role === 'STAFF' || role === 'VEHICLE_OWNER' || role === 'USER') && (
        <Tab.Screen name="Vehicles" component={VehiclesScreen} />
      )}
      
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      
      {(role === 'ADMIN' || role === 'STAFF') && (
        <Tab.Screen name="Finance" component={FinanceScreen} />
      )}
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#060D0B' }}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user !== null ? <AppTabs /> : <PublicStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
