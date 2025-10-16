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
  fetchAuthSession
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
  User 
} from '../types/auth';

Amplify.configure(awsConfig);

if (!validateAwsConfig()) {
  console.error('AWS configuration is incomplete. Authentication may not work properly.');
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User | null; isAuthenticated: boolean } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isLoading: false,
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
      : {};
    
    return {
      id: cognitoUser.userId || cognitoUser.username,
      username: cognitoUser.username,
      email: attributes.email || cognitoUser.username,
      firstName: '',
      lastName: '',
      isVerified: true, 
    };
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: credentials.email,
        password: credentials.password,
      });

      if (isSignedIn) {
        await getCurrentUser();
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        throw new Error('Please verify your email address before signing in.');
      } else {
        throw new Error('Authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error.message || 'Login failed. Please check your credentials.' 
      });
      throw error;
    }
  };

  const signUpUser = async (data: SignUpData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const result = await signUp({
        username: data.email,
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
              username: data.email,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              isVerified: false,
            }, 
            isAuthenticated: false 
          } 
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error.message || 'Sign up failed. Please try again.' 
      });
      throw error;
    }
  };

  const confirmSignUpUser = async (data: ConfirmSignUpData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const result = await confirmSignUp({
        username: data.email,
        confirmationCode: data.confirmationCode,
      });

      if (result.isSignUpComplete) {
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { 
            user: null, 
            isAuthenticated: false 
          } 
        });
      }
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error.message || 'Email verification failed. Please check your code.' 
      });
      throw error;
    }
  };

  const resendConfirmationCode = async (email: string): Promise<void> => {
    try {
      await resendSignUpCode({ username: email });
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

  const getCurrentUserData = async (): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await getCurrentUser();
      const mappedUser = mapCognitoUserToUser(user);
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { 
          user: mappedUser, 
          isAuthenticated: true 
        } 
      });
    } catch (error: any) {
      console.error('Get current user error:', error);
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
      console.error('Refresh auth error:', error);
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  useEffect(() => {
    refreshAuth();
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
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};