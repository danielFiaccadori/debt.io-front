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
import HomeScreen from './HomeScreen';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [isSignUpVisible, setIsSignUpVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const separatorOpacity = useRef(new Animated.Value(1)).current;
	const errorOpacity = useRef(new Animated.Value(0)).current;
	const { login, token, isLoading } = useAuth();

	const handleLogin = async () => {
		setErrorMessage('');
		const response = await login(email, password);
			
		if (response.success) {
			console.log('Usuário logado com sucesso: ', response.message);
		} else {
			setErrorMessage(response.message);

			Animated.timing(separatorOpacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true
			}).start();

			Animated.timing(errorOpacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true
			}).start(() => {
				setTimeout(() => {
					Animated.timing(errorOpacity, {
						toValue: 0,
						duration: 300,
						useNativeDriver: true
					}).start();

					Animated.timing(separatorOpacity, {
						toValue: 1,
						duration: 300,
						useNativeDriver: true
					}).start(() => setErrorMessage(''));
				}, 5000);
			});
		}
	};

	useEffect(() => {
		const showSub = Keyboard.addListener('keyboardDidShow', () => {
		  Animated.timing(separatorOpacity, {
			toValue: 0,
			duration: 200,
			useNativeDriver: true,
			easing: Easing.out(Easing.ease),
		  }).start();
		});
	  
		const hideSub = Keyboard.addListener('keyboardDidHide', () => {
		  Animated.timing(separatorOpacity, {
			toValue: 1,
			duration: 200,
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
					{errorMessage ? (
						<Animated.View style={[styles.errorMessageContainer, { opacity: errorOpacity }]}>
						<Text style={styles.errorMessage}>{errorMessage}</Text>
						</Animated.View>
					) : (
						<Animated.View style={[styles.errorMessageContainer, { opacity: separatorOpacity }]}>
						<FormSeparator text="login" />
						</Animated.View>
					)}
					</View>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{ flex: 1 }}
					keyboardVerticalOffset={40}
				>
				<StatusBar translucent backgroundColor="transparent" style="light" />
			
				<View style={styles.loginBox}>
					<LoginInputForm
						value={email}
						label="E-mail"
						onChangeText={setEmail}
						keyboardType="default"
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
		backgroundColor: "#040D12"
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
		borderColor: '#5C8374',
		borderRadius: 7,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10
	},
	checked: {
		width: 12,
		height: 12,
		backgroundColor: '#5C8374',
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
		color: '#5C8374',
		fontFamily: 'Inter_400Regular',
	},
	errorMessageContainer: { 
		width: '100%', 
		alignItems: 'center', 
		paddingHorizontal: 20, 
		paddingVertical: 10, 
		borderRadius: 10, 
		marginBottom: 50,
		marginTop: -40
	},
  	errorMessage: {
		color: 'red', 
		fontSize: 12,
		textAlign: 'center'
	}
});

export default LoginScreen;