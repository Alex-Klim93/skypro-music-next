import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logoutUser } from './authApi';

interface User {
  id: number;
  username: string;
  email: string;
  [key: string]: unknown;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
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

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },

    logout: (state) => {
      const refreshToken = state.refreshToken;

      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        logoutUser(refreshToken);
      }
    },
  },
});

export const { setTokens, setAccessToken, setUser, logout } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
