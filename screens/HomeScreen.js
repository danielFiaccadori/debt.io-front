import { StatusBar } from 'expo-status-bar';
import { React, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashLargeButton from '../components/LargeButton';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import * as NavigationBar from 'expo-navigation-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import MainHeader from '../components/MainHeader';
import { BalanceCard, BalanceProgressCircle, LastDebts } from '../components/BalanceCard';
import Button from '../components/LargeButton';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {

       const { getUserBalance, getUserDebts } = useAuth();

       useFocusEffect(
              useCallback(() => {
                     getUserBalance();
                     getUserDebts();
              }, [])
       );

       NavigationBar.setBackgroundColorAsync('#ffffff00');
       NavigationBar.setPositionAsync('absolute');

       return (
              <SafeAreaProvider>
                     <LinearGradient
                            colors={['#040D12', '#040D12']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.gradient}
                     >
                            <SafeAreaView style={styles.container}>
                                   <StatusBar translucent backgroundColor="#183D3D" style="light" />
                                   <ScrollView
                                          contentContainerStyle={styles.scrollContainer}
                                          showsVerticalScrollIndicator={false}>
                                          <View style={styles.headerContainer}>
                                                 <MainHeader />
                                          </View>
                                          <View style={styles.contentContainer}>
                                                 <BalanceCard />
                                                 <LastDebts />
                                          </View>
                                   </ScrollView>
                            </SafeAreaView>
                     </LinearGradient>
              </SafeAreaProvider>
       );
};

export default HomeScreen;

const styles = StyleSheet.create({
       gradient: {
              flex: 1,
       },
       container: {
              flex: 1,
       },
       contentText: {
              color: 'white',
              fontSize: 16,
              marginBottom: 10,
              fontFamily: 'Inter_400Regular',
       },
       contentContainer: {
              paddingHorizontal: 20,
              paddingVertical: 20
       }
});
