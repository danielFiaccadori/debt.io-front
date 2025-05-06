import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashLargeButton from '../components/LargeButton';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
       const { signOut } = useAuth();

       const handleLogOut = () => {
              signOut();
       }

       return (
              <SafeAreaProvider>
                     <SafeAreaView style={styles.container}>
                                   <StatusBar translucent backgroundColor="transparent" style="dark" />
                            <Text>HomeScreen</Text>
                            <SplashLargeButton onPress={handleLogOut} placeholder="LogOut"/>
                     </SafeAreaView>
              </SafeAreaProvider>
       );
}

export default HomeScreen;

const styles = StyleSheet.create({
       container: {
              container: {
                     flex: 1,
                     alignItems: 'center',
                     justifyContent: 'center'
              },
       }
});