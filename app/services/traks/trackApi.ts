import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../constants';
import { TrackType } from '@/app/sharedTypes/sharedTypes';

// Базовые функции API без интерсепторов
const baseApi = axios.create({
  baseURL: BASE_URL,
});

export const getAllTracks = (
  accessToken: string = '',
): Promise<TrackType[]> => {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  return baseApi.get('/catalog/track/all/', { headers }).then((res) => {
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  });
};

export const getFavoriteTracks = (
  accessToken: string = '',
): Promise<TrackType[]> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return baseApi
    .get('/catalog/track/favorite/all/', {
      headers,
    })
    .then((res) => {
      if (res.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return [];
    });
};

export const addToFavoritesApi = (
  accessToken: string,
  id: number,
): Promise<any> => {
  return baseApi.post(
    `/catalog/track/${id}/favorite/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
};

export const removeFromFavoritesApi = (
  accessToken: string,
  id: number,
): Promise<any> => {
  return baseApi.delete(`/catalog/track/${id}/favorite/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Функция refreshToken (экспортируем для использования в withReauth)
export const refreshToken = async (refresh: string) => {
  const response = await axios.post(
    `${BASE_URL}/user/token/refresh/`,
    { refresh },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

// Утилита withReauth
export const withReauth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  refreshTokenValue: string,
  dispatch: any,
  setAccessToken: (token: string) => void,
): Promise<T> => {
  try {
    const accessToken = localStorage.getItem('access_token') || '';
    return await apiFunction(accessToken);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      try {
        const newTokens = await refreshToken(refreshTokenValue);
        localStorage.setItem('access_token', newTokens.access);
        if (newTokens.refresh) {
          localStorage.setItem('refresh_token', newTokens.refresh);
        }
        if (dispatch && setAccessToken) {
          dispatch(setAccessToken(newTokens.access));
        }
        return await apiFunction(newTokens.access);
      } catch (refreshError) {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/Signin';
        throw refreshError;
      }
    }
    throw error;
  }
};

// Функции с авто-обновлением токена
export const addToFavorites = async (
  id: number,
  refreshTokenValue: string,
  dispatch: any,
  setAccessToken: any,
): Promise<void> => {
  return withReauth(
    (accessToken) => addToFavoritesApi(accessToken, id),
    refreshTokenValue,
    dispatch,
    setAccessToken,
  );
};

export const removeFromFavorites = async (
  id: number,
  refreshTokenValue: string,
  dispatch: any,
  setAccessToken: any,
): Promise<void> => {
  return withReauth(
    (accessToken) => removeFromFavoritesApi(accessToken, id),
    refreshTokenValue,
    dispatch,
    setAccessToken,
  );
};

// Для обратной совместимости
export const getTracks = getAllTracks;
