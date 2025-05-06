import React, { useState, useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Animated,
    Easing
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginAnimation from './LoginAnimation';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import LoginInputForm from './InputForm';
import Button from './LargeButton';
import StepDotsIndicator from '../components/StepDotsIndicator';
import { useAuth } from '../contexts/AuthContext';
import { Masks } from 'react-native-mask-input';

const SignUpModal = ({ visible, onClose }) => {
    const [step, setStep] = useState(1);

    // Dados do formulário
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [rendaMensal, setRendaMensal] = useState('');
    const { signUp } = useAuth();

    const handleSignUp = () => {
        signUp(nome, sobrenome, email, senha, cpf, telefone, dataNascimento, rendaMensal)
    }

    const insets = useSafeAreaInsets();

    const backLayer1Anim = useState(new Animated.Value(0.85))[0];
    const backLayer2Anim = useState(new Animated.Value(0.90))[0];

    const modalTranslateY = useRef(new Animated.Value(1000)).current;

    useEffect(() => {
        if (step >= 2) {
            Animated.timing(backLayer1Anim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }).start();
        }
        if (step >= 3) {
            Animated.timing(backLayer2Anim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }).start();
        }
    }, [step]);

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

    const resetForm = () => {
        setNome('');
        setSobrenome('');
        setTelefone('');
        setEmail('');
        setDataNascimento('');
        setRendaMensal('');
        setCpf('');
        setStep(1);
        backLayer1Anim.setValue(0.85);
        backLayer2Anim.setValue(0.9);
    };

    const renderStepOne = () => (
        <>
            <Text style={styles.stepTitle}>Dados Pessoais</Text>
            {renderField('Nome', nome, setNome)}
            {renderField('Sobrenome', sobrenome, setSobrenome)}
            {renderField('Telefone', telefone, setTelefone, 'phone-pad')}
            {renderField('E-mail', email, setEmail, 'email-address')}
            {renderField('Senha de acesso', senha, setSenha, 'default', true)}
        </>
    );

    const renderStepTwo = () => (
        <>
            <Text style={styles.stepTitle}>Dados de Documento</Text>
            {renderField('Data de Nascimento', dataNascimento, setDataNascimento)}
            {renderField('Renda Mensal', rendaMensal, setRendaMensal, 'numeric')}
            {renderField('CPF', cpf, setCpf, 'numeric')}
        </>
    );

    const renderStepThree = () => (
        <View style={styles.confirmationContainer}>
            <LoginAnimation source={require('../assets/animations/success.json')} loop={false} />
            <Text style={styles.confirmationText}>Cadastro realizado com sucesso!</Text>
        </View>
    );

    const renderField = (label, value, setter, keyboardType = 'default', isPassword) => {
        let mask = undefined;
        switch (label) {
            case 'CPF':
                mask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
                break;
                case 'Telefone':
                mask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
                break;
                case 'Data de Nascimento':
                mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
                break;
                case 'Renda Mensal':
                mask = Masks.BRL_CURRENCY;
                break;
                default:
                mask = undefined;
        }

        return (
            <LoginInputForm
                label={label}
                value={value}
                onChangeText={setter}
                keyboardType={keyboardType}
                autoCapitalize="none"
                style="light"
                mask={mask}
                secureTextEntry={isPassword}
            />
        );
    } 

    const handleNext = () => {
        if (step === 1) {
          if (!nome || !sobrenome || !telefone || !email) {
            alert('Por favor, preencha todos os campos da Etapa 1.');
            return;
          }
        }
      
        if (step === 2) {
          if (!dataNascimento || !rendaMensal || !cpf) {
            alert('Por favor, preencha todos os campos da Etapa 2.');
            return;
          }
          handleSignUp();
        }
      
        setStep((prev) => prev + 1);
    };      

    const handleBack = () => setStep((prev) => prev - 1);

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
                        <Text style={styles.title}>Cadastro</Text>
                        <Text style={styles.subtitle}>Etapa {step} de 3</Text>

                        <StepDotsIndicator
                            currentStep={step}
                            totalSteps={3}
                        />

                        {step === 1 && renderStepOne()}
                        {step === 2 && renderStepTwo()}
                        {step === 3 && renderStepThree()}

                        
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                            {step > 1 && step < 3 && (
                                <Button onPress={handleBack} placeholder="Voltar"/>
                            )}

                            {step < 3 && (
                                <Button onPress={handleNext} placeholder="Próximo"/>
                            )}

                            {step === 3 && (
                                <Button onPress={() => {
                                    onClose();
                                    resetForm();
                                }}
                                placeholder="Finalizar"
                                />
                            )}
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
        paddingBottom: 30
    },
    title: {
        fontSize: 24,
		fontFamily: 'Inter_700Bold',
        color: '#5a66d1',
        marginBottom: 5
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: '#333',
        marginBottom: 20
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Inter_400Regular',
        marginBottom: 15,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 15
    },
    inputLabel: {
        fontSize: 13,
        color: '#717482',
        marginBottom: 5
    },
    input: {
        backgroundColor: '#f0f1f5',
        color: '#000',
        borderWidth: 0.5,
        borderColor: '#d1d3e0',
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#5a66d1',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginLeft: 10
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 15,
		fontFamily: 'Inter_700Bold',
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#2d343f',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginRight: 10
    },
    secondaryButtonText: {
        color: '#fff',
        fontFamily: 'Inter_400Regular',
        fontSize: 15
    },
    confirmationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    confirmationText: {
        marginTop: 20,
		fontFamily: 'Inter_700Bold',
        fontSize: 16,
        color: '#333'
    }
});

export default SignUpModal;
