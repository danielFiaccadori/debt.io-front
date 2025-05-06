import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import InitialLoading from './screens/InitialLoadingScreen';
import { Octicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Shadow } from 'react-native-shadow-2';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen}/>
      {/* Se tiver outras telas ligadas à Home, adicione aqui */}
    </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarBackground: () => (
          <BlurView
            experimentalBlurMethod='none'
            tint="dark"
            intensity={90}
            style={{ flex: 1 }}
          />
        ),
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          borderTopWidth: 0.75,
          borderColor: 'rgba(255, 255, 255, 0.125)',
          height: 100,
        },
        tabBarActiveTintColor: '#5f9afa',
        tabBarInactiveTintColor: '#2e335c',
        tabBarItemStyle: {
          padding: 20,
          margin: 0,
        },
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({ focused, color, size }) => {

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center'}}>
              {focused && (
                <Shadow
                  distance={10}
                  startColor="rgba(95, 154, 250, 0.25)"
                  offset={[0, -53]}
                  radius={10}
                  safeRender={true}
                  sides={{ top: false, bottom: true, start: true, end: true }}
                  corners={{ topStart: false, topEnd: false, bottomStart: true, bottomEnd: true }}
                  containerStyle={{
                    position: 'absolute',
                    bottom: -8,
                    width: 40,
                    height: 8,
                    borderRadius: 4,
                  }}
                  >
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 47.5,
                      width: 40,
                      height: 5,
                      borderBottomRightRadius: 4,
                      borderBottomLeftRadius: 4,
                      backgroundColor: 'rgba(95, 154, 250, 1)',
                    }}
                  >
                  </View>
                </Shadow>
              )}
              <Octicons style={{marginTop: 5}} name="home" size={size} color={color} />
            </View>
          );
        },
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

  if (isLoading) return <InitialLoading />;

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
  }
});
