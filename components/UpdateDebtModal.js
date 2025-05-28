import React, { useEffect, useRef, useState } from 'react';
import {
    Modal, View, Text, StyleSheet, SafeAreaView,
    ScrollView, Animated, Easing
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginInputForm from './InputForm';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CategoryDropdown } from './CategoryDropdown';
import Button from './LargeButton';
import { Masks } from 'react-native-mask-input';
import { useAuth } from '../contexts/AuthContext';
import { getUserData } from '../api/api';

const UpdateDebtModal = ({ visible, onClose, debtData, onSave }) => {
    const insets = useSafeAreaInsets();
    const modalTranslateY = useRef(new Animated.Value(1000)).current;
    const backLayer1Anim = useRef(new Animated.Value(0.85)).current;
    const backLayer2Anim = useRef(new Animated.Value(0.90)).current;

    const { updateUserDebt, getUserBalance, getUserData, getUserDebtList } = useAuth();

    const [debtName, setDebtName] = useState('');
    const [value, setValue] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [category, setCategory] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [isRecorrent, setIsRecorrent] = useState(false);

    useEffect(() => {
        if (visible && debtData) {
            setDebtName(debtData.nomeCompra);
            setValue(`R$ ${Number(debtData.valor).toFixed(2)}`);
            setPaymentMethod(debtData.tipoPagamento);
            setCategory(debtData.categoria);
            setExpiryDate(debtData.dataVencimento);
            setIsRecorrent(debtData.contaRecorrente || false);
        }
    }, [visible, debtData]);

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
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar translucent backgroundColor="transparent" style="light" />

                <Animated.View
                    style={[
                        styles.backLayer1,
                        {
                            opacity: backLayer1Anim,
                            transform: [{ translateY: backLayer1Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
                        },
                    ]}
                />

                <Animated.View
                    style={[
                        styles.backLayer2,
                        {
                            opacity: backLayer2Anim,
                            transform: [{ translateY: backLayer2Anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
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
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>Atualizar Conta</Text>

                        <LoginInputForm label="Nome da Conta" value={debtName} onChangeText={setDebtName} style="light" />
                        <LoginInputForm label="Valor" value={value} onChangeText={setValue} keyboardType="numeric" mask={Masks.BRL_CURRENCY} style="light" />
                        <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
                        <CategoryDropdown selectedCategory={category} onSelect={setCategory} />
                        <LoginInputForm label="Data de Vencimento" value={expiryDate} onChangeText={setExpiryDate} mask={[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/]} style="light" />
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <Button onPress={onClose} placeholder="Cancelar" />
                        <Button
                            onPress={async () => {
                                await updateUserDebt(
                                    debtData.id,
                                    debtName,
                                    value,
                                    paymentMethod,
                                    category,
                                    expiryDate,
                                    isRecorrent
                                );
                                onClose();
                                getUserData();
                                getUserDebtList();
                                getUserBalance();
                            }}
                            placeholder="Salvar"
                        />
                    </View>
                </Animated.View>
            </SafeAreaView>
        </Modal>
    );
};

export default UpdateDebtModal;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
    },
    backLayer1: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
    },
    backLayer2: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f9f9fc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingTop: 20,
        maxHeight: '100%',
    },
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 30
    },
    title: {
        fontSize: 22,
        fontFamily: 'Inter_700Bold',
        color: '#5C8374',
        marginBottom: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    }
});
