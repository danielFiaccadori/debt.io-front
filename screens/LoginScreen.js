import { React, useRef, useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, Pressable, KeyboardAvoidingView, Platform, Animated, Keyboard, Easing } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import LoginAnimation from '../components/LoginAnimation';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import SignUpModal from '../components/SignUpModal';
import FormSeparator from '../components/FormSeparator';
import LoginInputForm from '../components/InputForm';
import Button from '../components/LargeButton';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
	const [cpf, setCpf] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [isSignUpVisible, setIsSignUpVisible] = useState(false);
	const separatorOpacity = useRef(new Animated.Value(1)).current;
	const { login, isLoading, authError } = useAuth();

	const handleLogin = () => {
		login(cpf, password);
	}

	useEffect(() => {
		const showSub = Keyboard.addListener('keyboardDidShow', () => {
		  Animated.timing(separatorOpacity, {
			toValue: 0,
			duration: 250,
			useNativeDriver: true,
			easing: Easing.out(Easing.ease),
		  }).start();
		});
	  
		const hideSub = Keyboard.addListener('keyboardDidHide', () => {
		  Animated.timing(separatorOpacity, {
			toValue: 1,
			duration: 250,
			useNativeDriver: true,
			easing: Easing.out(Easing.ease),
		  }).start();
		});
	  
		return () => {
		  showSub.remove();
		  hideSub.remove();
		};
	  }, []);

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<View style={styles.topMessageContainer}>
					<LoginAnimation source={require('../assets/animations/login_animation.json')} loop={false}/>
					<Animated.View style={{ opacity: separatorOpacity }}>
						<FormSeparator text="login" />
					</Animated.View>
				</View>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{ flex: 1 }}
					keyboardVerticalOffset={40}
				>
				<StatusBar translucent backgroundColor="transparent" style="light" />
			
				<View style={styles.loginBox}>
					<LoginInputForm
						value={cpf}
						label="E-mail ou CPF"
						onChangeText={setCpf}
						keyboardType="numeric"
						autoCapitalize="none"
					/>
					<LoginInputForm
						value={password}
						label="Senha"
						onChangeText={setPassword}
						secureTextEntry
						autoCapitalize="none"
					/>

					{/* Lembrar de mim */}
					<View style={styles.rememberContainer}>
						<Pressable onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
							{rememberMe && <View style={styles.checked} />}
						</Pressable>
						<Text style={styles.rememberText}>Lembrar de mim</Text>
					</View>

					<Button
						onPress={handleLogin}
						disabled={isLoading}
						placeholder="Entrar"
					/>

					<Text>
						
					</Text>
					<TouchableOpacity 
						onPress={() => setIsSignUpVisible(true)}
						style={styles.registerLink}
					>
						<Text style={styles.registerLinkText}><Text style={styles.registerLinkTextPre}>Ainda não possui uma conta? </Text>Cadastre-se</Text>
					</TouchableOpacity>
				</View>
				</KeyboardAvoidingView>
				<SignUpModal
					visible={isSignUpVisible}
					onClose={() => setIsSignUpVisible(false)}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0d0d11"
	},
	topMessageContainer: {
		height: '30%',
		marginTop: '20%',
		marginBottom: 40,
		marginHorizontal: 60,
		justifyContent: 'center',
		alignItems: 'center'
	},
	topMessage: {
		color: '#5a66d1',
		fontFamily: 'Inter_700Bold',
		fontSize: 30,
		marginTop: '15%',
		textAlign: 'center'
	},
	topMessageSubtitle: {
		color: 'white',
		fontFamily: 'Inter_400Regular',
		fontSize: 20,
		textAlign: 'center'
	},
	loginBox: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	rememberContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '75%',
		marginTop: 10
	},
	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 1,
		borderColor: '#5a66d1',
		borderRadius: 7,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10
	},
	checked: {
		width: 12,
		height: 12,
		backgroundColor: '#5a66d1',
		borderRadius: 4
	},
	rememberText: {
		fontSize: 12.5,
		color: 'white',
		fontFamily: 'Inter_400Regular'
	},
	loginButton: {
		backgroundColor: '#5a66d1',
		width: '75%',
		paddingVertical: 15,
		borderRadius: 50,
		alignItems: 'center',
		marginTop: 30,
		elevation: 2
	},
	loginButtonText: {
		color: 'white',
		fontSize: 15,
		fontWeight: 'bold',
	},
	registerLink: {
		marginTop: 20
	},
	registerLinkTextPre: {
		fontSize: 12.5,
		color: 'white',
		fontFamily: 'Inter_400Regular',
	},
	registerLinkText: {
		fontSize: 12.5,
		color: '#5a66d1',
		fontFamily: 'Inter_400Regular',
	}
});

export default LoginScreen;
