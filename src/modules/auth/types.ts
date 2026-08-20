export interface LoginCredentials {
  email: string;
  password: string;
}

/* ==================================================
 * SIGNUP
 * ================================================== */

export interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
  contact: string;
  role: string;
}

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
 * AUTH RESPONSE
 * ================================================== */

export interface AuthResponse {
  success: boolean;

  isAuthenticated: boolean;

  message?: string;

  /*
   * Backend returns the authenticated user
   * inside "data".
   */
  data?: AuthUser;

  /*
   * Keep this optional in case login/signup
   * returns a token.
   */
  token?: string;
}

/* ==================================================
 * VERIFY OTP
 * ================================================== */

export interface VerifyOTPCredentials {
  email: string;
  otp: string;
}

/* ==================================================
 * FORGOT PASSWORD - SEND OTP
 * ================================================== */

export interface ForgotPasswordSendOTPCredentials {
  email: string;
}

/* ==================================================
 * FORGOT PASSWORD - RESET
 * ================================================== */

export interface ForgotPasswordResetCredentials {
  email: string;
  otp: string;
  newPassword: string;
}