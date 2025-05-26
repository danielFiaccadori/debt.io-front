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
import DebtsScreen from './screens/DebtsScreen';
import ProfileScreen from './screens/ProfileScreen';

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
    experimentalBlurMethod='dimezisBlurView'
    tint='systemChromeMaterialDark'
    intensity={70}
    style={{
      ...StyleSheet.absoluteFillObject,
      overflow: 'hidden',
      backgroundColor: 'transparent'
    }}
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
        tabBarActiveTintColor: '#93B1A6',
        tabBarInactiveTintColor: '#5C8374',
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              return (
                <View style={focused ? styles.iconContainerActive : styles.iconContainerInactive}>
                  <Octicons name={iconName} size={size} color={color} />
                </View>
              );
            case 'Wallet':
              iconName = 'calendar';
              return (
                <View style={focused ? styles.iconContainerActive : styles.iconContainerInactive}>
                  <Octicons name={iconName} size={size} color={color} />
                </View>
              );
            case 'Profile':
              iconName = 'person';
              return (
                <View style={focused ? styles.iconContainerActive : styles.iconContainerInactive}>
                  <Octicons name={iconName} size={size} color={color} />
                </View>
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Wallet" component={DebtsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
    height: 70,
    borderRadius: 30,
    borderTopWidth: 0,
    elevation: 2,
    overflow: 'hidden',
    bottom: 40,
    marginHorizontal: 70,
    borderWidth: 0,
  },
  tabBarItemStyle: {
    top: 5,
    padding: 10,
    height: 60,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(63, 63, 63, 0.75)',
    borderRadius: 22,
    height: 50,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerInactive: {
    borderRadius: 20,
    height: 50,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
