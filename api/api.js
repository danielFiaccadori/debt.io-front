import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import emmiter from '../utils/EventEmitter';

const API_URL = 'http://192.168.1.8:8080'

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado ou inválido. Executando logout automático...');
      emmiter.emit('unauthorized');
    }
    return Promise.reject(error);
  }
);

export const canSpend = async (
  id,
  valorAlvo
) => {
  try {
    const valorLimpo = parseFloat(
      valorAlvo.replace(/[R$\s.]/g, '').replace(',', '.')
    );

    const response = await api.post('api/v1/usuario/verificar-gasto', id, valorLimpo);
    console.log(response.data.result);
  } catch (error) {
    console.error('Can spend error(api): ', error);

    if (error.response?.data?.validations) {
      for (const err of error.response.data.validations) {
        console.warn(`${err.field}: ${err.message}`);
      }
    }

    return null;
  }
}

export const updateDebt = async (
  id,
  nomeCompra,
  valor,
  tipoPagamento,
  categoria,
  dataVencimento,
  contaRecorrente
) => {
  try {
    const [dia, mes, ano] = dataVencimento.split('/');

    const dataFormatada = `${ano}-${mes}-${dia}`;

    const valorLimpo = parseFloat(
      valor.replace(/[R$\s.]/g, '').replace(',', '.')
    );

    const payload = {
      id,
      nomeCompra,
      valor: valorLimpo,
      tipoPagamento,
      categoria,
      dataVencimento: dataFormatada,
      contaRecorrente
    };

    const response = await api.put('/api/v1/contas/atualizar', payload);

    return response.data.result;
  } catch (error) {
    console.error('Update debt error(api): ', error);

    if (error.response?.data?.validations) {
      for (const err of error.response.data.validations) {
        console.warn(`${err.field}: ${err.message}`);
      }
    }

    return null;
  }
}

export const createDebt = async (
  usuarioId,
  nomeCompra,
  valor,
  tipoPagamento,
  categoria,
  dataVencimento,
  contaRecorrente
) => {
  try {
    const [dia, mes, ano] = dataVencimento.split('/');

    const dataFormatada = `${ano}-${mes}-${dia}`;

    const valorLimpo = parseFloat(
      valor.replace(/[R$\s.]/g, '').replace(',', '.')
    );

    const payload = {
      usuarioId,
      nomeCompra,
      valor: valorLimpo,
      tipoPagamento,
      categoria,
      dataVencimento: dataFormatada,
      contaRecorrente
    };

    const response = await api.post('/api/v1/contas/criar', payload);

    return response.data.result;
  } catch (error) {
    console.error('Create debt error(api): ', error);

    if (error.response?.data?.validations) {
      for (const err of error.response.data.validations) {
        console.warn(`${err.field}: ${err.message}`);
      }
    }

    return null;
  }
}

export const listDebts = async (id) => {
  try {
    const response = await api.get(`/api/v1/contas/listar/usuario/${id}`);
    console.log('Debt list: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Error obtaining user debt list: ', error);
  }
}

export const getDebts = async (id) => {
  try {
    const response = await api.get(`/api/v1/contas/total-gasto-mes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error obtaining user debts: ', error);
  }
}

export const getBalance = async (id) => {
  try {
    const response = await api.get(`/api/v1/contas/saldo-disponivel/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error obtaining user balance: ', error);
  }
}

export const getUserData = async (id) => {
  try {
    const response = await api.get(`/api/v1/usuario/id/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error obtaining user data:', error);
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/api/v1/auth/login', { email, password });
    console.log('API Response: ', response.data);

    return {
      success: response.data.success,
      message: response.data.message,
      userId: response.data.result.id,
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
  rendaMensal,
  percentualGastos,
  fotoPerfilBase64
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
      rendaMensal: rendaLimpa,
      percentualGastos,
      fotoPerfilBase64
    };

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
