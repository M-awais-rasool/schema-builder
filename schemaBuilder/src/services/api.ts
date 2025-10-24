import api from '../lib/axios';
import type {
  LoginCredentials,
  SignUpData,
  ConfirmSignUpData,
  ForgotPasswordData,
  ResetPasswordData,
  User,
} from '../types/auth';

export const authApi = {
  register: async (data: SignUpData) => {
    const response = await api.post('/auth/register', {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.username,
    });
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  verify: async (data: ConfirmSignUpData) => {
    const response = await api.post('/auth/verify', {
      email: data.username, 
      code: data.confirmationCode,
    });
    return response.data;
  },

  resendCode: async (email: string) => {
    const response = await api.post('/auth/resend-code', { email });
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await api.post('/auth/forgot-password', { email: data.email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await api.post('/auth/reset-password', {
      email: data.email,
      confirmation_code: data.confirmationCode,
      new_password: data.newPassword,
    });
    return response.data;
  },

  googleAuth: async (idToken: string) => {
    const response = await api.post('/auth/google', { id_token: idToken });
    return response.data;
  },

  checkUser: async (email: string) => {
    const response = await api.post('/auth/check-user', { email });
    return response.data;
  },
};

export const userApi = {
  getProfile: async (): Promise<{ data: User }> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },
};

export const schemaApi = {
  create: async (data: any) => {
    const response = await api.post('/schemas', data);
    return response.data;
  },

  getUserSchemas: async (page = 1, limit = 10) => {
    const response = await api.get('/schemas', {
      params: { page, limit },
    });
    return response.data;
  },

  getOtherUsersSchemas: async (page = 1, limit = 10) => {
    const response = await api.get('/schemas/others', {
      params: { page, limit },
    });
    return response.data;
  },

  getPublicSchemas: async (page = 1, limit = 10) => {
    const response = await api.get('/schemas/public', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/schemas/${id}`);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/schemas/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/schemas/${id}`);
    return response.data;
  },

  duplicate: async (id: string, newName: string) => {
    const response = await api.post(`/schemas/${id}/duplicate`, { name: newName });
    return response.data;
  },

  toggleVisibility: async (id: string) => {
    const response = await api.patch(`/schemas/${id}/visibility`);
    return response.data;
  },
};

export const aiApi = {
  chat: async (message: string, sessionId?: string) => {
    const response = await api.post('/ai/chat', {
      message,
      session_id: sessionId,
    });
    return response.data;
  },
};

export const apiService = {
  auth: authApi,
  user: userApi,
  schema: schemaApi,
  ai: aiApi,
};