import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.1.3:8080'

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/api/v1/auth/login', { email, password });
    console.log('API Response:', response.data);

    return {
      success: response.data.success,
      message: response.data.message,
      result: response.data.result || null,
    };
  } catch (error) {
    console.log('Login error: ', error.response?.data?.message);

    const { message, code, validations } = error.response?.data || {};

    return {
      success: false,
      message: message || "Erro desconhecido.",
      result: null,
      code: code || "UNKNOWN_ERROR",
      validations: validations || [],
    };
  }
};


export const signUpUser = async (
  nome,
  sobrenome,
  email,
  senha,
  cpf,
  telefone,
  dataNascimento,
  rendaMensal
) => {
  try {
    const cpfNumeros = cpf.replace(/[^\d]/g, '');
    const telefoneNumeros = telefone.replace(/[^\d]/g, '');

    const cpfFormatado = cpfNumeros.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );

    const telefoneFormatado = telefoneNumeros.replace(
      /(\d{2})(\d{5})(\d{4})/,
      '($1) $2-$3'
    );

    const [dia, mes, ano] = dataNascimento.split('/');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const rendaLimpa = parseFloat(
      rendaMensal.replace(/[R$\s.]/g, '').replace(',', '.')
    );

    const payload = {
      nome,
      sobrenome,
      email,
      senha,
      cpf: cpfFormatado,
      telefone: telefoneFormatado,
      dataNascimento: dataFormatada,
      rendaMensal: rendaLimpa
    };

    console.log('Payload final para API:', payload);

    const response = await api.post('/api/v1/auth/registrar', payload);

    return response.data.result;
  } catch (error) {
    console.error('Sign-up error: ', error);

    if (error.response?.data?.validations) {
      for (const err of error.response.data.validations) {
        console.warn(`${err.field}: ${err.message}`);
      }
    }

    return null;
  }
};
