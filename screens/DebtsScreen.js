import { StatusBar } from 'expo-status-bar';
import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashLargeButton from '../components/LargeButton';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import * as NavigationBar from 'expo-navigation-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import MainHeader from '../components/MainHeader';
import { LastDebts, AllDebts } from '../components/BalanceCard';
import { NewDebtButton, NewDebtModal } from '../components/NewDebtModal';

const DebtsScreen = () => {

       const { getUserBalance, getUserDebts } = useAuth();

       useFocusEffect(
              useCallback(() => {
                     getUserBalance();
                     getUserDebts();
              }, [])
       );

       useEffect(() => {
              getUserBalance();
              getUserDebts();
       }, []);

       NavigationBar.setBackgroundColorAsync('#ffffff00');
       NavigationBar.setPositionAsync('absolute');

       const [showNewDebtModal, setShowNewDebtModal] = useState(false);

       const handleOpenNewDebtModal = () => setShowNewDebtModal(true);
       const handleCloseNewDebtModal = () => setShowNewDebtModal(false)

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

                                   <View style={styles.headerContainer}>
                                          <MainHeader />
                                   </View>

                                   <ScrollView
                                          contentContainerStyle={styles.contentContainer}
                                          showsVerticalScrollIndicator={false}
                                   >
                                          <AllDebts />
                                   </ScrollView>

                                   {/* Botão flutuante */}
                                   <View style={styles.floatingButton}>
                                          <NewDebtButton onPress={handleOpenNewDebtModal} />
                                   </View>

                                   <NewDebtModal visible={showNewDebtModal} onClose={handleCloseNewDebtModal} />
                            </SafeAreaView>
                     </LinearGradient>
              </SafeAreaProvider>
       );
};

export default DebtsScreen;

const styles = StyleSheet.create({
       gradient: {
              flex: 1,
       },
       container: {
              flex: 1,
       },
       contentContainer: {
              paddingHorizontal: 20,
              paddingVertical: 20,
              paddingBottom: 100,
       },
       floatingButton: {
              position: 'absolute',
              bottom: 130,
              left: 0,
              right: 0,
              alignItems: 'center',
              zIndex: 10,
       },
});