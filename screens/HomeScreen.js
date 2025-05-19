import { StatusBar } from 'expo-status-bar';
import { React } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashLargeButton from '../components/LargeButton';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import * as NavigationBar from 'expo-navigation-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import MainHeader from '../components/MainHeader';
import BalanceCard from '../components/BalanceCard';

const HomeScreen = () => {

       NavigationBar.setBackgroundColorAsync('#ffffff00');
       NavigationBar.setPositionAsync('absolute');

       const { signOut } = useAuth();

       const handleLogOut = () => {
              signOut();
       };

       return (
              <SafeAreaProvider>
                     <LinearGradient
                            colors={['#05050a', '#18172b']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.gradient}
                     >
                            <SafeAreaView style={styles.container}>
                                   <StatusBar translucent backgroundColor="transparent" style="light" />
                                   <ScrollView
                                          contentContainerStyle={styles.scrollContainer}
                                          showsVerticalScrollIndicator={false}>
                                          <View style={styles.headerContainer}>
                                                 <MainHeader />
                                          </View>
                                          <View style={styles.contentContainer}>
                                                 <BalanceCard />
                                          </View>
                                          <SplashLargeButton onPress={handleLogOut} placeholder="Sair" />
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
