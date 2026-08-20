import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  login as loginAPI,
  signup as signupAPI,
  logout as logoutAPI,
  verifyOTP as verifyOTPAPI,
  forgotPasswordSendOTP as forgotPasswordSendOTPAPI,
  forgotPasswordVerifyOTP as forgotPasswordVerifyOTPAPI,
  checkAuth as checkAuthAPI,
} from "../api/auth.api"; 

import type {
  LoginCredentials,
  SignupCredentials,
  VerifyOTPCredentials,
  ForgotPasswordSendOTPCredentials,
  ForgotPasswordResetCredentials,
  AuthResponse,
} from "../types";

/* ==================================================
 * AUTH USER
 * ================================================== */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  role?: string;
}

/* ==================================================
 * AUTH STATE
 * ================================================== */

export interface AuthState {
  user: AuthUser | null;

  loading: boolean;

  /*
   * false:
   * Authentication has not been checked yet.
   *
   * true:
   * Authentication initialization is complete.
   */
  initialized: boolean;

  error: string | null;

  isAuthenticated: boolean;
}

/* ==================================================
 * INITIAL STATE
 * ================================================== */

const initialState: AuthState = {
  user: null,

  /*
   * Start with loading because we need to check
   * whether an existing session is available.
   */
  loading: true,

  /*
   * VERY IMPORTANT:
   *
   * This prevents ProtectedRoute from immediately
   * redirecting to /login on browser refresh.
   */
  initialized: false,

  error: null,

  isAuthenticated: false,
};

/* ==================================================
 * LOGIN
 * ================================================== */

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/login",
  async (
    credentials,
    { rejectWithValue }
  ) => {
    try {
      return await loginAPI(credentials);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message
        );
      }

      return rejectWithValue(
        "Login failed"
      );
    }
  }
);

/* ==================================================
 * SIGNUP
 * ================================================== */

export const signupUser = createAsyncThunk<
  AuthResponse,
  SignupCredentials,
  { rejectValue: string }
>(
  "auth/signup",
  async (
    credentials,
    { rejectWithValue }
  ) => {
    try {
      return await signupAPI(credentials);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message
        );
      }

      return rejectWithValue(
        "Signup failed"
      );
    }
  }
);

/* ==================================================
 * LOGOUT
 * ================================================== */

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "auth/logout",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      await logoutAPI();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message
        );
      }

      return rejectWithValue(
        "Logout failed"
      );
    }
  }
);

/* ==================================================
 * VERIFY OTP
 * ================================================== */

export const verifyOTP = createAsyncThunk<
  AuthResponse,
  VerifyOTPCredentials,
  { rejectValue: string }
>(
  "auth/verifyOTP",
  async (
    credentials,
    { rejectWithValue }
  ) => {
    try {
      return await verifyOTPAPI(
        credentials
      );
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message
        );
      }

      return rejectWithValue(
        "OTP verification failed"
      );
    }
  }
);

/* ==================================================
 * FORGOT PASSWORD - SEND OTP
 * ================================================== */

export const forgotPasswordSendOTP =
  createAsyncThunk<
    { message: string },
    ForgotPasswordSendOTPCredentials,
    { rejectValue: string }
  >(
    "auth/forgotPasswordSendOTP",
    async (
      credentials,
      { rejectWithValue }
    ) => {
      try {
        return await forgotPasswordSendOTPAPI(
          credentials
        );
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(
            error.message
          );
        }

        return rejectWithValue(
          "Failed to send OTP"
        );
      }
    }
  );

/* ==================================================
 * FORGOT PASSWORD - VERIFY OTP
 * ================================================== */

export const forgotPasswordVerifyOTP =
  createAsyncThunk<
    { message: string },
    ForgotPasswordResetCredentials,
    { rejectValue: string }
  >(
    "auth/forgotPasswordVerifyOTP",
    async (
      credentials,
      { rejectWithValue }
    ) => {
      try {
        return await forgotPasswordVerifyOTPAPI(
          credentials
        );
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(
            error.message
          );
        }

        return rejectWithValue(
          "Failed to reset password"
        );
      }
    }
  );

/* ==================================================
 * CHECK AUTH
 * ================================================== */

export const checkAuth = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>(
  "auth/checkAuth",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      console.log(
        "CHECK AUTH → API START"
      );

      const response =
        await checkAuthAPI();

      console.log(
        "CHECK AUTH → API RESPONSE",
        response
      );

      return response;
    } catch (error) {
      console.error(
        "CHECK AUTH → API ERROR",
        error
      );

      if (error instanceof Error) {
        return rejectWithValue(
          error.message
        );
      }

      return rejectWithValue(
        "Session expired"
      );
    }
  }
);

/* ==================================================
 * SLICE
 * ================================================== */

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ==========================================
       * LOGIN
       * ========================================== */

      .addCase(
        loginUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        loginUser.fulfilled,
        (state, action) => {
          state.loading = false;

          /*
           * Backend should return:
           *
           * {
           *   data: {...}
           * }
           */
          state.user =
            action.payload.data ?? null;

          state.isAuthenticated =
            action.payload.isAuthenticated ??
            true;

          state.initialized = true;

          state.error = null;
        }
      )

      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.loading = false;

          state.user = null;

          state.isAuthenticated = false;

          state.initialized = true;

          state.error =
            action.payload ||
            "Login failed";
        }
      )

      /* ==========================================
       * SIGNUP
       * ========================================== */

      .addCase(
        signupUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        signupUser.fulfilled,
        (state, action) => {
          state.loading = false;

          state.user =
            action.payload.data ?? null;

          state.isAuthenticated =
            action.payload.isAuthenticated ??
            true;

          state.initialized = true;

          state.error = null;
        }
      )

      .addCase(
        signupUser.rejected,
        (state, action) => {
          state.loading = false;

          state.user = null;

          state.isAuthenticated = false;

          state.initialized = true;

          state.error =
            action.payload ||
            "Signup failed";
        }
      )

      /* ==========================================
       * LOGOUT
       * ========================================== */

      .addCase(
        logoutUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        logoutUser.fulfilled,
        (state) => {
          state.loading = false;

          state.user = null;

          state.isAuthenticated = false;

          /*
           * Authentication system has already
           * been initialized.
           */
          state.initialized = true;

          state.error = null;
        }
      )

      .addCase(
        logoutUser.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Logout failed";
        }
      )

      /* ==========================================
       * VERIFY OTP
       * ========================================== */

      .addCase(
        verifyOTP.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        verifyOTP.fulfilled,
        (state, action) => {
          state.loading = false;

          state.user =
            action.payload.data ?? null;

          state.isAuthenticated =
            action.payload.isAuthenticated ??
            true;

          state.initialized = true;

          state.error = null;
        }
      )

      .addCase(
        verifyOTP.rejected,
        (state, action) => {
          state.loading = false;

          state.isAuthenticated = false;

          state.initialized = true;

          state.error =
            action.payload ||
            "OTP verification failed";
        }
      )

      /* ==========================================
       * FORGOT PASSWORD - SEND OTP
       * ========================================== */

      .addCase(
        forgotPasswordSendOTP.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        forgotPasswordSendOTP.fulfilled,
        (state) => {
          state.loading = false;

          state.error = null;
        }
      )

      .addCase(
        forgotPasswordSendOTP.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to send OTP";
        }
      )

      /* ==========================================
       * FORGOT PASSWORD - RESET
       * ========================================== */

      .addCase(
        forgotPasswordVerifyOTP.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        forgotPasswordVerifyOTP.fulfilled,
        (state) => {
          state.loading = false;

          state.error = null;
        }
      )

      .addCase(
        forgotPasswordVerifyOTP.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to reset password";
        }
      )

      /* ==========================================
       * CHECK AUTH
       * ========================================== */

      .addCase(
        checkAuth.pending,
        (state) => {
          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        checkAuth.fulfilled,
        (state, action) => {
          console.log(
            "CHECK AUTH FULFILLED PAYLOAD:",
            action.payload
          );

          state.loading = false;

          /*
           * IMPORTANT:
           *
           * Your actual API response is:
           *
           * {
           *   success: true,
           *   isAuthenticated: true,
           *   data: {
           *     id,
           *     name,
           *     email,
           *     role
           *   }
           * }
           *
           * Therefore use "data", NOT "user".
           */
          state.user =
            action.payload.data ?? null;

          state.isAuthenticated =
            action.payload.isAuthenticated ===
            true;

          /*
           * Authentication initialization
           * is now complete.
           */
          state.initialized = true;

          state.error = null;
        }
      )

      .addCase(
        checkAuth.rejected,
        (state, action) => {
          state.loading = false;

          state.user = null;

          state.isAuthenticated = false;

          /*
           * Even a failed auth check means
           * initialization is finished.
           */
          state.initialized = true;

          state.error =
            action.payload ||
            "Session expired";
        }
      );
  },
});

/* ==================================================
 * EXPORTS
 * ================================================== */

export const {
  clearError,
} = authSlice.actions;

export default authSlice.reducer;