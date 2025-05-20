import React, { useRef, useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Animated,
    Easing,
    TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from './LargeButton'; // ajuste o caminho se necessário
import { Octicons } from '@expo/vector-icons';

export const NewDebtButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.newDebtButton}>
            <View style={styles.row}>
                <Octicons name="inbox" size={20} color="white" style={styles.icon} />
                <View>
                    <Text style={styles.newDebtTitle}>Nova Conta</Text>
                    <Text style={styles.newDebtSubtitle}>Crie uma nova conta e a adicione na lista</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export const NewDebtModal = ({ visible, onClose }) => {
    const insets = useSafeAreaInsets();
    const modalTranslateY = useRef(new Animated.Value(1000)).current;
    const backLayer1Anim = useState(new Animated.Value(0.85))[0];
    const backLayer2Anim = useState(new Animated.Value(0.90))[0];

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
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={styles.title}>Nova Conta</Text>
                        <Text style={styles.subtitle}>Preencha os dados da nova conta</Text>

                        {/* Campos virão aqui futuramente Kaique */}

                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={onClose}
                            placeholder="Cancelar"
                        />
                        <Button
                            onPress={() => { }}
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
        alignItems: 'center',
        maxHeight: '100%',
        backgroundColor: '#f9f9fc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        overflow: 'hidden',
        paddingTop: 20,
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
    backLayer1: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#00000015',
        zIndex: -1,
    },
    backLayer2: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#00000010',
        zIndex: -2,
    },
    newDebtButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        marginHorizontal: 20,
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