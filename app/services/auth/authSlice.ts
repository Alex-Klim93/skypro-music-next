import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logoutUser } from './authApi';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
}

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
    };
  }

  return {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ access: string; refresh: string }>,
    ) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', action.payload.access);
        localStorage.setItem('refresh_token', action.payload.refresh);
      }
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', action.payload);
      }
    },

    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },

    // Обновленный logout с поддержкой серверного выхода
    logout: (state) => {
      // Сохраняем refresh токен перед очисткой
      const refreshToken = state.refreshToken;

      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;

      if (typeof window !== 'undefined') {
        // Очищаем локальное хранилище
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        // Вызываем серверный logout
        logoutUser(refreshToken);
      }
    },
  },
});

export const { setTokens, setAccessToken, setUser, logout } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
