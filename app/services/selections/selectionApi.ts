import axios from 'axios';
import { BASE_URL } from '../constants';

const api = axios.create({
  baseURL: BASE_URL,
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Интерцептор для обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${BASE_URL}/user/token/refresh/`,
          {
            refresh: refreshToken,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
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

export type SelectionType = {
  id: number;
  name: string;
  logo: string | null;
  items?: any[];
  tracks?: any[];
};

export const getAllSelections = (): Promise<SelectionType[]> => {
  return api.get('/catalog/selection/all').then((res) => {
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  });
};

export const getSelectionById = (id: number): Promise<SelectionType> => {
  return api.get(`/catalog/selection/${id}/`).then((res) => {
    if (res.data) {
      return res.data;
    }
    throw new Error('Selection not found');
  });
};