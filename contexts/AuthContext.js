import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signUpUser, getUserData, getBalance, getDebts, listDebts, createDebt, canSpend, updateDebt, updateUserData } from '../api/api';
import * as SecureStore from 'expo-secure-store';
import emmiter from '../utils/EventEmitter';

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

  useEffect(() => {
    const listener = () => {
      console.log('Token expirado. Fazendo logout...');
      signOut();
    };

    emmiter.on('unauthorized', listener);

    return () => {
      emmiter.off('unauthorized', listener);
    };
  }, []);

  useEffect(() => {
    const autoLogOut = async () => {
      const savedToken = await SecureStore.getItemAsync('token');
      if (!savedToken) {
        signOut();
      }
    };
    autoLogOut();
  }, []);

  async function updateUserDebt(debtId, debtName, value, paymentType, category, expiryDate, isRecorrent) {
    try {
      const response = await updateDebt(debtId, debtName, value, paymentType, category, expiryDate, isRecorrent);
      console.log('Request: ', response);
    } catch (error) {
      console.error('Erro ao atualizar uma Debt: ', error)
    }
  }

  async function canUserSpend(value) {
    try {
      const savedUserId = await SecureStore.getItemAsync('userId');
      const response = await canSpend(savedUserId, value);
      console.log(response);
    } catch (error) {
      console.error('Erro ao verificar se usuário pode gastar um valor: ', error)
    }
  }

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
      console.log(response);

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

  async function createNewDebt(userId, debtName, value, paymentMethod, category, expiryDate, isRecorrent) {
    setIsLoading(true);
    try {
      const canSpend = await canUserSpend(value);
      if (canSpend) {
        const data = await createDebt(userId, debtName, value, paymentMethod, category, expiryDate, isRecorrent);
        return data;
      }
      return canSpend;
    } catch (error) {
      console.error('Create debt error(Auth)', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(name, surname, email, password, cpf, phone, birthDate, monthlyIncome, profilePicBase64) {
    setIsLoading(true);
    try {
      const data = await signUpUser(name, surname, email, password, cpf, phone, birthDate, monthlyIncome, 1, profilePicBase64);
      return data;
    } catch (error) {
      console.error('Sign-up error', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateUserProfile(id, name, surname, email, cpf, phone, profilePicture, wastePercent) {
    setIsLoading(true);
    try {
      const data = await updateUserData(id, name, surname, email, cpf, phone, profilePicture, wastePercent);
      console.log("Tried to update user profile: ", data)
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }


  async function signOut() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('userId');
  }

  return (
    <AuthContext.Provider value={{ token, userId, isLoading, login, signOut, updateUserProfile, signUp, getLoggedUserData, updateUserDebt, getUserBalance, userData, userBalance, getUserDebts, userDebts, getUserDebtList, userDebtList, createNewDebt, canUserSpend }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
