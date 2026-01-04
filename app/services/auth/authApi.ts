import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../constants';

// Функция для автоматического обновления токена при 401 ошибке
export const withReauth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  refresh: string | null,
): Promise<T> => {
  try {
    const accessToken = localStorage.getItem('access_token');
    return await apiFunction(accessToken || '');
  } catch (error) {
    const axiosError = error as AxiosError;

    // Если ошибка 401 и есть refresh токен, обновляем токен
    if (axiosError.response?.status === 401 && refresh) {
      try {
        const newAccessToken = await refreshToken(refresh);

        // Сохраняем новый токен
        localStorage.setItem('access_token', newAccessToken.access);

        // Повторяем запрос с новым токеном
        return await apiFunction(newAccessToken.access);
      } catch (refreshError) {
        // Если обновление токена не удалось, очищаем сессию
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        throw refreshError;
      }
    }

    throw error;
  }
};

// Оригинальная функция авторизации с оптимизацией useCallback
export const authUser = async (data: { email: string; password: string }) => {
  // Сначала выполняем вход
  const loginResponse = await axios.post(`${BASE_URL}/user/login/`, data, {
    headers: { 'content-type': 'application/json' },
  });

  // Затем получаем токены
  const tokenResponse = await axios.post(`${BASE_URL}/user/token/`, data, {
    headers: { 'content-type': 'application/json' },
  });

  return {
    data: {
      ...loginResponse.data,
      tokens: tokenResponse.data,
    },
  };
};

export const registerUser = async (data: {
  email: string;
  password: string;
  username?: string;
}) => {
  // Регистрируем пользователя
  const registerResponse = await axios.post(`${BASE_URL}/user/signup/`, data, {
    headers: { 'content-type': 'application/json' },
  });

  // Если регистрация успешна, получаем токены
  if (registerResponse.data.success) {
    const tokenResponse = await axios.post(
      `${BASE_URL}/user/token/`,
      {
        email: data.email,
        password: data.password,
      },
      {
        headers: { 'content-type': 'application/json' },
      },
    );

    return {
      data: {
        ...registerResponse.data,
        tokens: tokenResponse.data,
      },
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
  return axios
    .post(
      `${BASE_URL}/user/token/refresh/`,
      { refresh },
      {
        headers: { 'content-type': 'application/json' },
      },
    )
    .then((response) => response.data);
};

// Функция для выхода из аккаунта
export const logoutUser = async (refreshToken: string | null) => {
  if (refreshToken) {
    try {
      await axios.post(
        `${BASE_URL}/user/logout/`,
        {
          refresh: refreshToken,
        },
        {
          headers: { 'content-type': 'application/json' },
        },
      );
    } catch (error) {
      console.error('Ошибка при выходе на сервере:', error);
    }
  }

  // Всегда очищаем локальное хранилище
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};
