import { StatusBar } from 'expo-status-bar';
import { React } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashLargeButton from '../components/LargeButton';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import * as NavigationBar from 'expo-navigation-bar';

const HomeScreen = () => {

       NavigationBar.setBackgroundColorAsync('#ffffff00');
       NavigationBar.setPositionAsync('absolute');

       const { signOut } = useAuth();

       const handleLogOut = () => {
              signOut();
       }

       return (
              <SafeAreaProvider>
                     <SafeAreaView style={styles.container}>
                            <StatusBar translucent backgroundColor="transparent" style="light" />
                            <Text style={{color: 'white', fontSize: 20}}>Quer conteúdo? Pede pro Kaique</Text>
                            <SplashLargeButton onPress={handleLogOut} placeholder="LogOut"/>
                     </SafeAreaView>
              </SafeAreaProvider>
       );
}

export default HomeScreen;

const styles = StyleSheet.create({
       container: {
              backgroundColor: "#0d0d0d",
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
       },
});