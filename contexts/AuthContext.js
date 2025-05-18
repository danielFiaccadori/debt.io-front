import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signUpUser } from '../api/api';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const savedToken = await SecureStore.getItemAsync('token');
      if (savedToken) {
        setToken(savedToken);
      }
      setIsLoading(false);
    };
    loadStorageData();
  }, []);

  async function login(username, password) {
  setIsLoading(true);
  try {
    const data = await loginUser(username, password);
    console.log('Full response:', data);

    if (data.success && data.result?.token) {
      setToken(data.result.token);
      await SecureStore.setItemAsync('token', data.result.token);
    }

    return {
      token: data.result?.token || null,
      message: data.message,
      success: data.success,
    };
  } catch (error) {
    console.error('Login error', error);

    return {
      success: false,
      message: "Erro ao realizar login.",
      token: null,
    };
  } finally {
    setIsLoading(false);
  }
}



  async function signUp(name, surname, email, password, cpf, phone, birthDate, monthlyIncome) {
    setIsLoading(true);
    try {
      const data = await signUpUser(name, surname, email, password, cpf, phone, birthDate, monthlyIncome);
      return data;
    } catch (error) {
      console.error('Sign-up error', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    setToken(null);
    await SecureStore.deleteItemAsync('token');
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, login, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
