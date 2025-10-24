import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase-config';
import { authApi, userApi } from '../services/api';
import type {
  AuthState,
  AuthContextType,
  LoginCredentials,
  SignUpData,
  ConfirmSignUpData,
  ForgotPasswordData,
  ResetPasswordData,
  User,
} from '../types/auth';

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User | null; isAuthenticated: boolean } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        error: null,
        isLoading: false,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: action.payload,
        isLoading: false,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authApi.login(credentials);

      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { 
            user: response.data.user, 
            isAuthenticated: true 
          },
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Login failed. Please check your credentials.',
      });
      throw error;
    }
  };

  const signUpUser = async (data: SignUpData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await authApi.register(data);

      // User created successfully, now they need to verify their email
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: {
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            isVerified: false,
          },
          isAuthenticated: false,
        },
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Sign up failed. Please try again.',
      });
      throw error;
    }
  };

  const confirmSignUpUser = async (data: ConfirmSignUpData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await authApi.verify(data);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: null, isAuthenticated: false },
      });
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Email verification failed. Please check your code.',
      });
      throw error;
    }
  };

  const resendConfirmationCode = async (identifier: string): Promise<void> => {
    try {
      await authApi.resendCode(identifier);
    } catch (error: any) {
      console.error('Resend confirmation code error:', error);
      throw new Error(error.message || 'Failed to resend confirmation code.');
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
    try {
      await authApi.forgotPassword(data);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw new Error(error.message || 'Failed to send password reset code.');
    }
  };

  const resetPasswordUser = async (data: ResetPasswordData): Promise<void> => {
    try {
      await authApi.resetPassword(data);
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to reset password.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem('authToken');
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error: any) {
      console.error('Logout error:', error);
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      let existingUserInfo = null;
      try {
        const checkResponse = await authApi.checkUser(user.email!);
        existingUserInfo = checkResponse.data;
      } catch (error) {
        console.log('Could not check existing user, continuing with Google auth');
      }

      const response = await authApi.googleAuth(idToken);

      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { 
            user: response.data.user, 
            isAuthenticated: true 
          },
        });

        if (existingUserInfo?.exists && existingUserInfo.provider === 'email') {
          console.log('Google account successfully linked to existing email account');
        } else if (!existingUserInfo?.exists) {
          console.log('New account created with Google');
        } else {
          console.log('Signed in with Google');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error.message || 'Google sign-in failed. Please try again.' 
      });
      throw error;
    }
  };

  const getCurrentUserData = async (): Promise<void> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      dispatch({ type: 'AUTH_LOGOUT' });
      return;
    }

    try {
      const response = await userApi.getProfile();
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.data, isAuthenticated: true },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('authToken');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const refreshAuth = async (): Promise<void> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      dispatch({ type: 'AUTH_LOGOUT' });
      return;
    }

    try {
      await getCurrentUserData();
    } catch (error) {
      console.error('Refresh auth error:', error);
      localStorage.removeItem('authToken');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        await getCurrentUserData();
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  const contextValue: AuthContextType = {
    ...state,
    login,
    signUp: signUpUser,
    confirmSignUp: confirmSignUpUser,
    resendConfirmationCode,
    forgotPassword,
    resetPassword: resetPasswordUser,
    logout,
    getCurrentUser: getCurrentUserData,
    refreshAuth,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
