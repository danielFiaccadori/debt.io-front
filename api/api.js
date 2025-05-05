import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.1.15:8080'

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

//TODO: Mudar as requisi��es HTTP quando finalizarmos
export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/api/v1/auth/login', { username, password });
        return response.data;
    } catch (error) {
        console.error('Login error: ', error);

        if (error.response?.data?.error) {
            console.error(error.response.data.error);
        } 

        return null;
    }
}

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
    const cpfLimpo = cpf.replace(/[^\d]/g, ''); 
    const telefoneLimpo = telefone.replace(/[^\d]/g, ''); 
    
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
      cpf: cpfLimpo,
      telefone: telefoneLimpo,
      dataNascimento: dataFormatada,
      rendaMensal: rendaLimpa
    };

    console.log('Payload final para API:', payload);

    const response = await api.post('/api/v1/auth/registrar', payload);
    return response.data;
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

  