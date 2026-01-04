import axios from 'axios';
import { BASE_URL } from '../constants';
import { TrackType } from '@/app/sharedTypes/sharedTypes';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const originalRequest = (error as any).config;

    if ((error as any).response?.status === 401 && !originalRequest._retry) {
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
  items: number[] | TrackType[];
  tracks: unknown[];
};

export const getAllSelections = (): Promise<SelectionType[]> => {
  return api.get('/catalog/selection/all').then((res) => {
    if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
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
    const selection = res.data?.data || res.data;

    if (selection) {
      if (Array.isArray(selection.items) && selection.items.length > 0) {
        // Пустая проверка
      }
      return selection;
    }
    throw new Error('Selection not found');
  });
};
