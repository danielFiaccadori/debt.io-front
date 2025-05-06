import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import InitialLoading from './screens/InitialLoadingScreen';

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';

function HomeTabs() {
    return (
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen}/>
        </Tab.Navigator>
    );
}

function RootNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <InitialLoading />
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      }}
    >
      {token ? (
        <>
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </>
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
});
