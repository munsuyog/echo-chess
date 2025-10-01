import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser, AuthTokens, ApiResponse } from "../../types/user.type";
import { userService } from "../../services/user.service";
import { AxiosError } from "axios";

interface UserState {
  user: IUser;
  isAuthenticated: boolean;
  loading: boolean;
  refreshToken: string | null;
  access_token: string | null;
  isGuest: boolean;
  error: string | null;
}

// Token storage helper functions
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const getTokens = () => ({
  accessToken: localStorage.getItem(TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
});

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Helper to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

// Async Thunks
export const guestLogin = createAsyncThunk<
  AuthTokens,
  void,
  { rejectValue: string }
>(
  'user/guestLogin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.guestLogin();
      const data = response.response.data;
      
      // Save tokens to localStorage
      saveTokens(data.access_token, data.refresh_token);
      
      return data;
    } catch (error) {
      clearTokens();
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const refreshAccessToken = createAsyncThunk<
  AuthTokens,
  void,
  { rejectValue: string }
>(
  'user/refreshAccessToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getTokens();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await userService.refreshToken({ 
        refresh_token: refreshToken 
      });
      const data = response.response.data;
      
      // Save new tokens
      saveTokens(data.access_token, data.refresh_token);
      
      return data;
    } catch (error) {
      clearTokens();
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      clearTokens();
      return;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState: UserState = {
  user: {},
  isAuthenticated: !!getTokens().accessToken,
  loading: false,
  refreshToken: getTokens().refreshToken,
  access_token: getTokens().accessToken,
  isGuest: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    restoreAuth: (state) => {
      const tokens = getTokens();
      state.access_token = tokens.accessToken;
      state.refreshToken = tokens.refreshToken;
      state.isAuthenticated = !!tokens.accessToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // Guest Login
      .addCase(guestLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(guestLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.access_token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.isGuest = action.payload.is_guest;
        state.error = null;
      })
      .addCase(guestLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Guest login failed';
        state.isAuthenticated = false;
      })
      
      // Refresh Access Token
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.access_token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.isGuest = action.payload.is_guest;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.user = {};
        state.access_token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Token refresh failed';
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = {};
        state.access_token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isGuest = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser, restoreAuth } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;
export const selectAccessToken = (state: { user: UserState }) => state.user.access_token;
export const selectIsGuest = (state: { user: UserState }) => state.user.isGuest;
export const selectLoading = (state: { user: UserState }) => state.user.loading;
export const selectError = (state: { user: UserState }) => state.user.error;
