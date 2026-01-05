import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@/app/services/constants';
import { AppDispatch } from '@/app/store/store';

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post(
    `${BASE_URL}/user/token/refresh/`,
    { refresh: refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const withReauth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  refreshToken: string,
  dispatch: AppDispatch,
  setAccessToken: (token: string) => void,
): Promise<T> => {
  try {
    const accessToken = localStorage.getItem('access_token') || '';
    return await apiFunction(accessToken);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      try {
        const newTokens = await refreshToken(refreshToken);
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
        window.location.href = '/page/Signin';
        throw refreshError;
      }
    }
    throw error;
  }
};
