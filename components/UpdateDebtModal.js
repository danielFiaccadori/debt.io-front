import React, { useEffect, useRef, useState } from 'react';
import {
    Modal, View, Text, StyleSheet, SafeAreaView,
    ScrollView, Animated
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginInputForm from './InputForm';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CategoryDropdown } from './CategoryDropdown';
import Button from './LargeButton';
import { Masks } from 'react-native-mask-input';
import { useAuth } from '../contexts/AuthContext';

const UpdateDebtModal = ({ visible, onClose, debtData, onSave }) => {
    const insets = useSafeAreaInsets();
    const modalTranslateY = useRef(new Animated.Value(1000)).current;

    const { updateUserDebt } = useAuth();

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
            }).start();
        } else {
            modalTranslateY.setValue(1000);
        }
    }, [visible]);

    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <SafeAreaView style={styles.safeArea}>
                <Animated.View
                    style={[styles.modalContainer, {
                        paddingBottom: insets.bottom + 20,
                        transform: [{ translateY: modalTranslateY }],
                    }]}
                >
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>Atualizar Conta</Text>

                        <LoginInputForm label="Nome da Conta" value={debtName} onChangeText={setDebtName} style="light" />
                        <LoginInputForm label="Valor" value={value} onChangeText={setValue} keyboardType="numeric" mask={Masks.BRL_CURRENCY} style="light" />
                        <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
                        <CategoryDropdown selectedCategory={category} onSelect={setCategory} />
                        <LoginInputForm label="Data de Vencimento" value={expiryDate} onChangeText={setExpiryDate} mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]} style="light" />

                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <Button onPress={onClose} placeholder="Cancelar" />
                        <Button
                            onPress={async () => {
                                await updateUserDebt(
                                    debtName,
                                    value,
                                    paymentMethod,
                                    category,
                                    expiryDate,
                                    isRecorrent
                                );
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

export default UpdateDebtModal;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f9f9fc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingTop: 20,
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
