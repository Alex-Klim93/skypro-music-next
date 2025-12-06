import axios from 'axios';
import { BASE_URL } from '../constants';
import { TrackType } from '@/app/sharedTypes/sharedTypes';

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
  _id: number;
  name: string;
  logo: string | null;
  items: TrackType[];
  tracks: TrackType[];
};

export const getAllSelections = (): Promise<SelectionType[]> => {
  return api.get('/catalog/selection/all').then((res) => {
    console.log('API Response for selections:', res.data);
    if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else if (
      res.data &&
      res.data.results &&
      Array.isArray(res.data.results)
    ) {
      return res.data.results;
    }
    return [];
  });
};

export const getSelectionById = (id: number): Promise<SelectionType> => {
  return api.get(`/catalog/selection/${id}/`).then((res) => {
    console.log('API Response for selection by id:', res.data);
    if (res.data) {
      // Проверяем разные структуры ответа для получения треков
      const selectionData = res.data;

      // 1. Проверяем поле items
      if (selectionData.items && Array.isArray(selectionData.items)) {
        return selectionData;
      }

      // 2. Проверяем поле tracks
      if (selectionData.tracks && Array.isArray(selectionData.tracks)) {
        return selectionData;
      }

      // 3. Проверяем прямое содержимое (если треки сразу в ответе)
      if (Array.isArray(selectionData)) {
        return {
          _id: id,
          name: 'Подборка',
          logo: null,
          items: selectionData,
          tracks: selectionData,
        };
      }

      // 4. Если структура неизвестна, возвращаем с пустыми треками
      return {
        _id: selectionData._id || id,
        name: selectionData.name || 'Подборка',
        logo: selectionData.logo || null,
        items: [],
        tracks: [],
      };
    }
    throw new Error('Selection not found');
  });
};

export const createSelection = (
  name: string,
  logoFile: File | null,
): Promise<SelectionType> => {
  const formData = new FormData();
  formData.append('name', name);

  if (logoFile) {
    formData.append('logo', logoFile);
  }

  return api
    .post('/catalog/selection', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      console.log('API Response for create selection:', res.data);
      if (res.data) {
        return res.data;
      }
      throw new Error('Failed to create selection');
    });
};

