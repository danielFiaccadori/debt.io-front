import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';

import MainHeader from '../components/MainHeader';
import Button from '../components/LargeButton';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  NavigationBar.setBackgroundColorAsync('#ffffff00');
  NavigationBar.setPositionAsync('absolute');

  const { userId, signOut, updateUserProfile, userData } = useAuth();

  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [gastoPercentual, setGastoPercentual] = useState(100);
  const [displayPercent, setDisplayPercent] = useState(100);

  useEffect(() => {
    if (userData) {
      const initialPercent = userData.percentualGastos ?? 100;
      setGastoPercentual(initialPercent);
      setDisplayPercent(initialPercent);
      setName(userData.nome || '');
      setProfilePicture(userData.fotoPerfilBase64 || '');
    }
  }, [userData]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (userId && userData) {
        updateUserProfile(
          userId,
          name,
          userData.sobrenome,
          userData.email,
          userData.cpf,
          userData.telefone,
          profilePicture,
          gastoPercentual
        );
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [name, profilePicture, gastoPercentual]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#040D12', '#040D12']} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <StatusBar translucent backgroundColor="#183D3D" style="light" />
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={{ uri: profilePicture || userData?.fotoPerfilBase64 }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={userData?.nome}
                placeholderTextColor="#aaa"
              />

              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>
                  Percentual de Gastos: {displayPercent}%
                </Text>
                <Slider
                  style={{
                    width: 200,
                    height: 40,
                  }}
                  minimumValue={0}
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
  scrollContainer: { padding: 20 },
  profileContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  profileImage: {
    width: 120,
    backgroundColor: 'gray',
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '50%',
    padding: 20,
    borderRadius: 8,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Inter_400Regular',
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
