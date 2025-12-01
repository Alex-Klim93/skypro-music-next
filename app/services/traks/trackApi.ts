import axios from 'axios';
import { BASE_URL } from '../constants';
import { TrackType } from '@/app/sharedTypes/sharedTypes';

// Создаем экземпляр axios с интерсепторами
const trackApi = axios.create({
  baseURL: BASE_URL,
});

// Интерцептор для добавления токена в заголовки
trackApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Интерцептор для обработки 401 ошибки и обновления токена
trackApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и запрос еще не повторялся
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Пытаемся обновить токен...');
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Запрашиваем новый access токен
        const response = await axios.post(
          `${BASE_URL}/user/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const newAccessToken = response.data.access;
        console.log('Новый токен получен:', newAccessToken);

        // Сохраняем новый токен
        localStorage.setItem('access_token', newAccessToken);

        // Обновляем заголовок и повторяем запрос
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return trackApi(originalRequest);
      } catch (refreshError) {
        console.error('Ошибка обновления токена:', refreshError);

        // Если refresh токен невалиден, очищаем localStorage и редиректим на вход
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/Signin';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const getAllTracks = (): Promise<TrackType[]> => {
  return trackApi.get('/catalog/track/all/').then((res) => {
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  });
};

export const getFavoriteTracks = (): Promise<TrackType[]> => {
  return trackApi.get('/catalog/track/favorite/all/').then((res) => {
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  });
};

export const addToFavorites = (id: number): Promise<void> => {
  return trackApi.post(`/catalog/track/${id}/favorite/`, {});
};

export const removeFromFavorites = (id: number): Promise<void> => {
  return trackApi.delete(`/catalog/track/${id}/favorite/`);
};

// Для обратной совместимости
export const getTracks = getAllTracks;
