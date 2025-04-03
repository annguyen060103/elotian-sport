import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { introspect, login, logout, refresh } from "./authAPI";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }: { username: string; password: string }) => {
    const data = await login(username, password);
    return data;
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (refreshToken: string) => {
    const data = await refresh(refreshToken);
    return data;
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await logout();
});

export const introspectToken = createAsyncThunk(
  "auth/introspect",
  async (token: string) => {
    const data = await introspect(token);
    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.result.token;
        state.isAuthenticated = action.payload.result.authenticated;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.result.token;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
