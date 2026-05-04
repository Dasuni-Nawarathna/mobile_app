import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthContext, isAdminOrStaff, isServiceProvider } from '../context/AuthContext';

// ── Public Screens ──────────────────────────────────────────────
import LoginScreen from '../screens/LoginScreen';
import GuestProfileScreen from '../screens/GuestProfileScreen';

// ── Role-Specific Screens ───────────────────────────────────────
import TouristStorefront from '../screens/TouristStorefront';
import ProviderDashboard from '../screens/ProviderDashboard';
import AdminControlPanel from '../screens/AdminControlPanel';
import ProfileScreen from '../screens/ProfileScreen';

// ── Shared Screens (existing) ───────────────────────────────────
import BookingsScreen from '../screens/BookingsScreen';
import PackagesScreen from '../screens/PackagesScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import FinanceScreen from '../screens/FinanceScreen';
import UsersScreen from '../screens/UsersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_STYLE: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: { 
    backgroundColor: '#060D0B', 
    borderTopColor: 'rgba(212,175,55,0.15)', 
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8
  },
  tabBarActiveTintColor: '#D4AF37',
  tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
};

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// Tab icon helper
const tabIcon = (label: string) => ({ color }: { focused: boolean; color: string }) => {
  const icons: Record<string, IconName> = {
    'Home': 'home-outline', 
    'Explore': 'compass-outline', 
    'Bookings': 'calendar-check-outline', 
    'Profile': 'account-outline',
    'Dashboard': 'view-dashboard-outline', 
    'My Rides': 'car-outline', 
    'Finance': 'cash-multiple', 
    'My Property': 'office-building-outline',
    'Control Panel': 'shield-key-outline', 
    'Users': 'account-group-outline', 
    'Settings': 'cog-outline'
  };
  return <MaterialCommunityIcons name={icons[label] || 'circle-outline'} size={24} color={color} />;
};

// ── Guest Tab Navigator (Public) ────────────────────────────────
const GuestTabs = () => (
  <Tab.Navigator screenOptions={TAB_STYLE}>
    <Tab.Screen
      name="Home"
      component={TouristStorefront}
      options={{ title: 'Yatara Ceylon', tabBarIcon: tabIcon('Home') }}
    />
    <Tab.Screen
      name="Explore"
      component={PackagesScreen}
      options={{ title: 'Explore Journeys', tabBarIcon: tabIcon('Explore') }}
    />
    <Tab.Screen
      name="Account"
      component={GuestProfileScreen}
      options={{ title: 'My Account', tabBarIcon: tabIcon('Profile') }}
    />
  </Tab.Navigator>
);

// ── Tourist Tab Navigator ───────────────────────────────────────
const TouristTabs = () => (
  <Tab.Navigator screenOptions={TAB_STYLE}>
    <Tab.Screen
      name="Home"
      component={TouristStorefront}
      options={{ title: 'Yatara Ceylon', tabBarIcon: tabIcon('Home') }}
    />
    <Tab.Screen
      name="Explore"
      component={PackagesScreen}
      options={{ title: 'Explore Journeys', tabBarIcon: tabIcon('Explore') }}
    />
    <Tab.Screen
      name="Bookings"
      component={BookingsScreen}
      options={{ title: 'My Bookings', tabBarIcon: tabIcon('Bookings') }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'My Profile', tabBarIcon: tabIcon('Profile') }}
    />
  </Tab.Navigator>
);

interface ProviderTabsProps {
  role: string;
}

// ── Provider (Driver / Hotel) Tab Navigator ─────────────────────
const ProviderTabs: React.FC<ProviderTabsProps> = ({ role }) => (
  <Tab.Navigator screenOptions={TAB_STYLE}>
    <Tab.Screen
      name="Dashboard"
      component={ProviderDashboard}
      options={{ title: role === 'DRIVER' ? 'Driver Dashboard' : 'Property Dashboard', tabBarIcon: tabIcon('Dashboard') }}
    />
    <Tab.Screen
      name="Bookings"
      component={BookingsScreen}
      options={{ title: 'Assignments', tabBarIcon: tabIcon('Bookings') }}
    />
    {role === 'DRIVER' && (
      <Tab.Screen
        name="My Rides"
        component={VehiclesScreen}
        options={{ title: 'My Fleet', tabBarIcon: tabIcon('My Rides') }}
      />
    )}
    {(role === 'HOTEL_MANAGER' || role === 'HOTEL_OWNER') && (
      <Tab.Screen
        name="My Property"
        component={PackagesScreen}
        options={{ title: 'My Services', tabBarIcon: tabIcon('My Property') }}
      />
    )}
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'My Profile', tabBarIcon: tabIcon('Profile') }}
    />
  </Tab.Navigator>
);

// ── Admin / Staff Tab Navigator ─────────────────────────────────
const AdminTabs = () => (
  <Tab.Navigator screenOptions={TAB_STYLE}>
    <Tab.Screen
      name="Control Panel"
      component={AdminControlPanel}
      options={{ title: 'Admin Panel', tabBarIcon: tabIcon('Control Panel') }}
    />
    <Tab.Screen
      name="Users"
      component={UsersScreen}
      options={{ title: 'Users', tabBarIcon: tabIcon('Users') }}
    />
    <Tab.Screen
      name="Bookings"
      component={BookingsScreen}
      options={{ title: 'All Bookings', tabBarIcon: tabIcon('Bookings') }}
    />
    <Tab.Screen
      name="Finance"
      component={FinanceScreen}
      options={{ title: 'Finance', tabBarIcon: tabIcon('Finance') }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'My Profile', tabBarIcon: tabIcon('Profile') }}
    />
  </Tab.Navigator>
);

// ── Smart Root — picks the correct tab set based on role ────────
const AuthenticatedRoot = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role || 'TOURIST';

  if (isAdminOrStaff(role)) return <AdminTabs />;
  if (isServiceProvider(role)) return <ProviderTabs role={role} />;
  // Default: TOURIST/ USER
  return <TouristTabs />;
};

// ── Public Stack (includes Guest Tabs) ──────────────────────────
const PublicStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GuestTabs" component={GuestTabs} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// ── Root Navigator ──────────────────────────────────────────────
const AppNavigator = () => {
  const { user, isLoading, bootChecked } = useContext(AuthContext);

  if (isLoading || !bootChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#060D0B' }}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={{ width: 140, height: 140, marginBottom: 20 }}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={{ color: 'rgba(255,255,255,0.3)', marginTop: 14, fontSize: 12, letterSpacing: 2 }}>
          YATARA CEYLON
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AuthenticatedRoot /> : <PublicStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
