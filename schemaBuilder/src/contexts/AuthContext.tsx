import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  signInWithRedirect,
} from 'aws-amplify/auth';
import { awsConfig, validateAwsConfig } from '../config/aws-config';
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

Amplify.configure(awsConfig as any);

if (!validateAwsConfig()) {
  console.error('AWS configuration is incomplete. Authentication may not work properly.');
}

type AuthAction =
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
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
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

  const mapCognitoUserToUser = (cognitoUser: any): User => {
    const attributes = cognitoUser.signInDetails?.loginId
      ? { email: cognitoUser.signInDetails.loginId }
      : cognitoUser.attributes || {};
    const email = attributes.email || cognitoUser.username || '';
    const firstName = attributes.given_name || attributes.name?.split(' ')[0] || '';
    const lastName = attributes.family_name || attributes.name?.split(' ').slice(1).join(' ') || '';
    const username = attributes.preferred_username || cognitoUser.username || email.split('@')[0];

    return {
      id: cognitoUser.userId || cognitoUser.username,
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      avatar: attributes.picture || '',
      isVerified: true, 
    };
  };

  const checkIfUserNeedsVerification = async (username: string): Promise<boolean> => {
    try {
      await resendSignUpCode({ username });
      return true;
    } catch (error: any) {
      if (error.name === 'InvalidParameterException' &&
        error.message?.includes('already confirmed')) {
        return false;
      }
      if (error.name === 'UserNotFoundException') {
        return false;
      }
      return true;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: credentials.email,
        password: credentials.password,
      });
      if (isSignedIn) {
        const user = await getCurrentUser();
        const mappedUser = mapCognitoUserToUser(user);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: mappedUser, isAuthenticated: true },
        });
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        const error = new Error('Please verify your email address before signing in.');
        error.name = 'UserNotConfirmedException';
        throw error;
      } else {
        throw new Error('Authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.message?.includes('Incorrect username or password.')) {
        const needsVerification = await checkIfUserNeedsVerification(credentials.email);
        if (needsVerification) {
          const unverifiedError = new Error('Please verify your email address before signing in.');
          unverifiedError.name = 'UserNotConfirmedException';
          dispatch({
            type: 'AUTH_ERROR',
            payload: unverifiedError.message,
          });
          throw unverifiedError;
        }
      }

      if (error.name === 'UserNotConfirmedException' ||
        error.code === 'UserNotConfirmedException' ||
        error.message?.includes('User is not confirmed')) {
        const unverifiedError = new Error('Please verify your email address before signing in.');
        unverifiedError.name = 'UserNotConfirmedException';
        dispatch({
          type: 'AUTH_ERROR',
          payload: unverifiedError.message,
        });
        throw unverifiedError;
      }

      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Login failed. Please check your credentials.',
      });
      throw error;
    }
  };

  const signUpUser = async (data: SignUpData): Promise<void> => {
    try {
      const result = await signUp({
        username: data.username,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            given_name: data.firstName,
            family_name: data.lastName,
            preferred_username: data.username,
          },
        },
      });

      if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
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
      }
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
    try {
      const result = await confirmSignUp({
        username: data.username,
        confirmationCode: data.confirmationCode,
      });

      if (result.isSignUpComplete) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: null, isAuthenticated: false },
        });
      }
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
      await resendSignUpCode({ username: identifier });
    } catch (error: any) {
      console.error('Resend confirmation code error:', error);
      throw new Error(error.message || 'Failed to resend confirmation code.');
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
    try {
      await resetPassword({ username: data.email });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw new Error(error.message || 'Failed to send password reset code.');
    }
  };

  const resetPasswordUser = async (data: ResetPasswordData): Promise<void> => {
    try {
      await confirmResetPassword({
        username: data.email,
        confirmationCode: data.confirmationCode,
        newPassword: data.newPassword,
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to reset password.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error: any) {
      console.error('Logout error:', error);
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      await signInWithRedirect({ 
        provider: 'Google' as const,
      });
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error.message || 'Google sign-in failed. Please try again.' 
      });
    }
  };

  const getCurrentUserData = async (): Promise<void> => {
    try {
      const user = await getCurrentUser();
      const mappedUser = mapCognitoUserToUser(user);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: mappedUser, isAuthenticated: true },
      });
    } catch {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const session = await fetchAuthSession();
      if (session.tokens?.accessToken) {
        await getCurrentUserData();
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        const mappedUser = mapCognitoUserToUser(user);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: mappedUser, isAuthenticated: true },
        });
      } catch {
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
