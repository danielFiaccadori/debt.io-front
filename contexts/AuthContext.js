import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signUpUser } from '../api/api';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadStorageData = async () => {
			const savedToken = await SecureStore.getItemAsync('token');
			const savedUser = await SecureStore.getItemAsync('user');

			if (savedToken && savedUser) {
				setToken(savedToken);
				setUser(JSON.parse(savedUser));
			}

			setIsLoading(false);
		}

		loadStorageData();
	}, []);

	async function login(username, password) {
		setIsLoading(true);
		try {
			const data = await loginUser(username, password);
			if (data) {
				setUser(data.user);
				setToken(data.token);
				await SecureStore.setItemAsync('token', data.token);
				await SecureStore.setItemAsync('user', JSON.stringify(data.user));
			}
		} catch (error) {
			console.error('Login error', error);
		} finally {
			setIsLoading(false);
		}
	}

	async function signUp(name, surname, email, password, cpf, phone, birthDate, monthlyIncome) {
		setIsLoading(true);
		try {
			const data = await signUpUser(name, surname, email, password, cpf, phone, birthDate, monthlyIncome);
			if (data) {
				setUser(data.user);
				setToken(data.token);
				await SecureStore.setItemAsync('token', data.token);
				await SecureStore.setItemAsync('user', JSON.stringify(data.user));
			}
		} catch (error) {
			console.error('Sign-up error', error);
		} finally {
			setIsLoading(false);
		}
	}

	async function signOut() {
		setUser(null);
		setToken(null);
		await SecureStore.deleteItemAsync('token');
		await SecureStore.deleteItemAsync('user');
	}

	return (
		<AuthContext.Provider value={{ user, isLoading, login, signOut, signUp }}>
			{children}
		</AuthContext.Provider>
	);

}

export function useAuth() {
	return useContext(AuthContext);
}