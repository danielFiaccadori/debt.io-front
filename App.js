import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import InitialLoading from './screens/InitialLoadingScreen';
import { Octicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

/**
 * TabBar Component
 */
const CustomTabBarBackground = () => (
  <BlurView
    tint='dark'
    intensity={40}
    style={styles.tabBarBackground}
  />
);

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarBackground: CustomTabBarBackground,
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarActiveTintColor: '#5f9afa',
        tabBarInactiveTintColor: '#2e335c',
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => (
          <View style={styles.iconContainer}>
            <Octicons name="home" size={size} color={color} />
          </View>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Wallet" component={HomeStack} />
      <Tab.Screen name="Profile" component={HomeStack} />
      <Tab.Screen name="Settings" component={HomeStack} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { token, isLoading } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      }}
    >
      {token ? (
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
      ) : (
        <>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    height: 80,
    borderRadius: 50,
    borderTopWidth: 0,
    elevation: 5,
    overflow: 'hidden',
    bottom: 40,
    marginHorizontal: 20,
    borderWidth: 0,
  },
  tabBarItemStyle: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 40,
  },
  tabBarBackground: {
    flex: 1,
    borderRadius: 50,
    overflow: 'hidden',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
