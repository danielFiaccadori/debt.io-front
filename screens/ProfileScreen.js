import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import MainHeader from '../components/MainHeader';

import Button from '../components/LargeButton';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  NavigationBar.setBackgroundColorAsync('#ffffff00');
  NavigationBar.setPositionAsync('absolute');

  const { userId, signOut, updateUserProfile, userData, getUserBalance } = useAuth();

  const [gastoPercentual, setGastoPercentual] = useState(100);
  const [displayPercent, setDisplayPercent] = useState(100);

  useEffect(() => {
    if (userData) {
      const initialPercent = 100;
      setGastoPercentual(initialPercent);
      setDisplayPercent(initialPercent);
      getUserBalance();
    }
  }, [userData]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (userId && userData) {
        updateUserProfile(
          userId,
          userData.nome,
          userData.sobrenome,
          userData.email,
          userData.cpf,
          userData.telefone,
          userData.fotoPerfilBase64,
          gastoPercentual
        );
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [gastoPercentual]);

  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#040D12', '#040D12']} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <StatusBar translucent backgroundColor="#183D3D" style="light" />
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View>
              <MainHeader />
            </View>
            <View style={styles.profileContainer}>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>
                  Percentual de Gastos: {displayPercent}%
                </Text>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={1}
                  maximumValue={100}
                  step={1}
                  minimumTrackTintColor="#24FF4B"
                  maximumTrackTintColor="#aaa"
                  thumbTintColor="#24FF4B"
                  onValueChange={setDisplayPercent}
                  onSlidingComplete={(value) => setGastoPercentual(value)}
                />
              </View>

              <Button placeholder="Sair" onPress={signOut} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  profileContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: 'gray',
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  sliderLabel: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 10,
  },
});
