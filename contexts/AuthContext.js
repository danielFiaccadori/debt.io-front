import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signUpUser, getUserData, getBalance, getDebts, listDebts } from '../api/api';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [userDebtList, setUserDebtList] = useState(null);
  const [userDebts, setUserDebts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const savedToken = await SecureStore.getItemAsync('token');
      const savedUserId = await SecureStore.getItemAsync('userId');

      if (savedToken) {
        setToken(savedToken);
      }
      if (savedUserId) {
        setUserId(savedUserId);
      }

      setIsLoading(false);
    };
    loadStorageData();
  }, []);

  async function getUserDebtList() {
    try {
      if (!userId) {
        console.warn('User ID não encontrado.');
        return null;
      }

      const response = await listDebts(userId);
      console.log(response)
      setUserDebtList(response.result);

    } catch (error) {
      console.error('Erro ao obter dados das Debts do usuário: ', error);
    }
  }

  async function getUserDebts() {
    try {
      if (!userId) {
        console.warn('User ID não encontrado.');
        return null;
      }

      const response = await getDebts(userId);
      setUserDebts(response.result);

    } catch (error) {
      console.error('Erro ao obter dados das Debts do usuário: ', error);
    }
  }

  async function getUserBalance() {
    try {
      if (!userId) {
        console.warn('User ID não encontrado.');
        return null;
      }

      const response = await getBalance(userId);
      setUserBalance(response.result);

    } catch (error) {
      console.error('Erro ao obter dados das Debts do usuário: ', error);
    }
  }

  async function getLoggedUserData() {
    try {
      if (!userId) {
        console.warn('User ID não encontrado.');
        return null;
      }

      const response = await getUserData(userId);
      setUserData(response.result);

    } catch (error) {
      console.error('Erro ao obter os dados do usuário: ', error);
    }
  }

  async function login(username, password) {
    setIsLoading(true);
    try {
      const data = await loginUser(username, password);
      console.log('Full response:', data);

      if (data.success && data.result?.token) {
        setToken(data.result.token);
        setUserId(data.userId);
        await SecureStore.setItemAsync('token', data.result.token);
        await SecureStore.setItemAsync('userId', data.userId);
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
    <AuthContext.Provider value={{ token, isLoading, login, signOut, signUp, getLoggedUserData, getUserBalance, userData, userBalance, getUserDebts, userDebts, getUserDebtList, userDebtList }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
