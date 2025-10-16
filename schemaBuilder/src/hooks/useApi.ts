import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export const useApi = () => {
  const { logout } = useAuth();

  const makeRequest = async (
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<Response> => {
    const { params, ...fetchOptions } = options;
    
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const token = localStorage.getItem('amplify-authenticator-authToken') || 
                  sessionStorage.getItem('amplify-authenticator-authToken');

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...fetchOptions.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        await logout();
        throw new Error('Session expired. Please login again.');
      }

      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  const get = async (endpoint: string, params?: Record<string, string>) => {
    return makeRequest(endpoint, { method: 'GET', params });
  };

  const post = async (endpoint: string, data?: any) => {
    return makeRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  const put = async (endpoint: string, data?: any) => {
    return makeRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  const del = async (endpoint: string) => {
    return makeRequest(endpoint, { method: 'DELETE' });
  };

  return {
    get,
    post,
    put,
    delete: del,
    makeRequest,
  };
};