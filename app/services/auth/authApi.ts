import axios from 'axios';
import { BASE_URL } from '../constants';

export const authUser = async (data: { email: string; password: string }) => {
  // 1. Сначала выполняем вход, чтобы получить данные пользователя
  const loginResponse = await axios.post(`${BASE_URL}/user/login/`, data, {
    headers: { 'content-type': 'application/json' },
  });

  // 2. Затем получаем токены
  const tokenResponse = await axios.post(`${BASE_URL}/user/token/`, data, {
    headers: { 'content-type': 'application/json' },
  });

  // Возвращаем объединенные данные
  return {
    data: {
      ...loginResponse.data,
      tokens: tokenResponse.data
    }
  };
};

export const registerUser = async (data: {
  email: string;
  password: string;
  username?: string;
}) => {
  // 1. Регистрируем пользователя
  const registerResponse = await axios.post(`${BASE_URL}/user/signup/`, data, {
    headers: { 'content-type': 'application/json' },
  });

  // 2. Если регистрация успешна, сразу получаем токены
  if (registerResponse.data.success) {
    const tokenResponse = await axios.post(`${BASE_URL}/user/token/`, {
      email: data.email,
      password: data.password
    }, {
      headers: { 'content-type': 'application/json' },
    });

    return {
      data: {
        ...registerResponse.data,
        tokens: tokenResponse.data
      }
    };
  }

  return registerResponse;
};

export const getTokens = (data: { email: string; password: string }) => {
  return axios.post(`${BASE_URL}/user/token/`, data, {
    headers: { 'content-type': 'application/json' },
  });
};

export const refreshToken = (refresh: string) => {
  return axios.post(
    `${BASE_URL}/user/token/refresh/`,
    { refresh },
    {
      headers: { 'content-type': 'application/json' },
    },
  );
};