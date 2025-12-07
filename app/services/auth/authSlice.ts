import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setTokens, setAccessToken, setUser, logout } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
