import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/api/authApi';
import { storageService } from '../../services/storage.service';
import { AuthState, User, LoginCredentials, SignupData } from '../../types/auth.types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        await storageService.setUserData(response.data.user);
        return response.data;
      }
      return rejectWithValue(response.error);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(data);
      if (response.success && response.data) {
        await storageService.setUserData(response.data.user);
        return response.data;
      }
      return rejectWithValue(response.error);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    await storageService.clearAll();
    return true;
  } catch (error: any) {
    await storageService.clearAll(); // Clear even if API call fails
    return rejectWithValue(error);
  }
});

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getSession();
      if (response.success && response.data) {
        await storageService.setUserData(response.data.user);
        return response.data;
      }
      return rejectWithValue(response.error);
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Check Session
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(checkSession.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;

