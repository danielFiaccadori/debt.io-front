import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from './LargeButton';
import { Octicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import LoginInputForm from './InputForm';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CategoryDropdown } from './CategoryDropdown';
import { Masks } from 'react-native-mask-input';
import { BlurView } from 'expo-blur';

export const NewDebtButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.newDebtButton}>
      <BlurView intensity={70} tint='systemChromeMaterialDark' style={styles.blurContainer} experimentalBlurMethod='dimezisBlurView'>
        <View style={styles.row}>
          <Octicons name="inbox" size={20} color="white" style={styles.icon} />
          <View>
            <Text style={styles.newDebtTitle}>Nova Conta</Text>
            <Text style={styles.newDebtSubtitle}>Crie uma nova conta e a adicione na lista</Text>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

export const NewDebtModal = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const modalTranslateY = useRef(new Animated.Value(1000)).current;
  const backLayer1Anim = useState(new Animated.Value(0.85))[0];
  const backLayer2Anim = useState(new Animated.Value(0.90))[0];

  const { createNewDebt, userId, getUserDebtList, getUserData, getUserBalance, canUserSpend } = useAuth();

  const [debtName, setDebtName] = useState('');
  const [value, setValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [category, setCategory] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isRecorrent, setIsRecorrent] = useState(false); // adicionar toggle futuramente

  useEffect(() => {
    if (visible) {
      Animated.spring(modalTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 50,
      }).start();
    } else {
      modalTranslateY.setValue(1000);
    }
  }, [visible]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar translucent backgroundColor="transparent" style="light" />

        <Animated.View
          style={[
            styles.backLayer1,
            {
              opacity: backLayer1Anim,
              transform: [
                {
                  translateY: backLayer1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.backLayer2,
            {
              opacity: backLayer2Anim,
              transform: [
                {
                  translateY: backLayer2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              paddingBottom: insets.bottom + 20,
              transform: [{ translateY: modalTranslateY }],
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Nova Conta</Text>
            <Text style={styles.subtitle}>Preencha os dados da nova conta</Text>

            <LoginInputForm
              label="Nome da Conta"
              value={debtName}
              onChangeText={setDebtName}
              style="light"
            />
            <LoginInputForm
              label="Valor"
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              style="light"
              mask={Masks.BRL_CURRENCY}
            />
            <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
            <CategoryDropdown selectedCategory={category} onSelect={setCategory} />
            <LoginInputForm
              label="Data de Vencimento"
              value={expiryDate}
              onChangeText={setExpiryDate}
              style="light"
              keyboardType="numeric"
              mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button onPress={onClose} placeholder="Cancelar" />
            <Button
              onPress={async () => {
                const result = await createNewDebt(
                  userId,
                  debtName,
                  value,
                  paymentMethod,
                  category,
                  expiryDate,
                  isRecorrent
                );

                if (!result) {
                  alert("Você não pode adicionar essa conta. Ela excede seu limite disponível.");
                  return;
                }

                onClose();
                await getUserDebtList();
                await getUserData();
                await getUserBalance();
              }}
              placeholder="Salvar"
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
  },

  modalContainer: {
    height: '100%',
    maxHeight: '100%',
    alignItems: 'center',
    backgroundColor: '#f9f9fc',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 20,
    overflow: 'hidden',
    elevation: 5,
  },

  scrollContainer: {
    alignItems: 'center',
    width: 350,
    marginTop: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#5C8374',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#333',
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },

  // Camadas de fundo (para efeito de profundidade ou blur overlay)
  backLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },

  backLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -2,
  },

  newDebtButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    elevation: 10,
  },

  blurContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 30,
    borderRadius: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    marginRight: 30,
  },

  newDebtTitle: {
    fontFamily: 'Inter_700Bold',
    color: 'white',
    fontSize: 15,
  },

  newDebtSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: 'white',
    fontSize: 11,
  },
});

