import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { 
  login as loginApi, 
  logout as logoutApi, 
  getStoredUser, 
  isAuthenticated
} from '../../Service/authService';
import type { LoginRequest } from '../../Service/authService';

// Define the auth state interface
export interface AuthState {
  user: {
    email: string;
    nameid: string;
    unique_name: string;
    role: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  loginMessage: string | null;
}

// Initial state - check if user is already logged in
const initialState: AuthState = {
  user: getStoredUser() || null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: isAuthenticated(),
  loading: false,
  error: null,
  loginMessage: null,
};

// Async thunk for login API call
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous logout
    logout: (state) => {
      logoutApi(); // Clear localStorage
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      state.loginMessage = null;
    },
    // Clear any errors
    clearError: (state) => {
      state.error = null;
    },
    // Set loading state manually if needed
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login pending
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Login fulfilled
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.accessToken = action.payload.accessToken || null;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.error = null;
        state.loginMessage = action.payload.message || null;
      })
      // Login rejected
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.loginMessage = null;
      });
  },
});

// Export actions
export const { logout, clearError, setLoading } = authSlice.actions;

// Export selectors for easy access to auth state
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Export reducer
export default authSlice.reducer;
