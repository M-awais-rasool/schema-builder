export interface User {
  id?: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface ConfirmSignUpData {
  username: string; 
  confirmationCode: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  confirmationCode: string;
  newPassword: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar?: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  confirmSignUp: (data: ConfirmSignUpData) => Promise<void>;
  resendConfirmationCode: (identifier: string) => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

