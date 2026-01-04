import { ApiResponse, ErrorResponse, RequestHeaders } from '../types/api';

const API_URL = '/api';

interface StoredUser {
  token: string;
  name: string;
  email?: string;
  role: string;
}

let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: createHeaders(),
    });

    if (response.ok) {
      const { token } = await response.json();
      const userStr = localStorage.getItem('yapee_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.token = token;
        localStorage.setItem('yapee_user', JSON.stringify(user));
      }
      return token;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const getAuthHeader = (): RequestHeaders => {
  const userStr = localStorage.getItem('yapee_user');
  if (userStr) {
      try {
          const user: StoredUser = JSON.parse(userStr);
          if (user.token) {
              return { 'Authorization': `Bearer ${user.token}` };
          }
      } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('yapee_user');
      }
  }
  return {};
};

const createHeaders = (additionalHeaders: RequestHeaders = {}): RequestHeaders => {
  return {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...additionalHeaders
  };
};

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
      .then(token => {
        const newOptions = {
            ...response.json(),
            headers: createHeaders(),
        };
        return fetchWithAuth(response.url, newOptions);
      })
      .then(res => handleResponse<T>(res));
    }

    isRefreshing = true;

    const newToken = await refreshToken();
    isRefreshing = false;
    if (newToken) {
        processQueue(null, newToken);
        const newOptions = {
            ...response.json(),
            headers: createHeaders(),
        };
        return fetchWithAuth(response.url, newOptions).then(res => handleResponse<T>(res));
    } else {
        processQueue(new Error('Failed to refresh token'), null);
        // maybe logout user
    }
  }

  if (!response.ok) {
      const errorText = await response.text();
      let errorData: ErrorResponse;
      
      try {
          errorData = JSON.parse(errorText) as ErrorResponse;
      } catch {
          errorData = {
              success: false,
              error: `HTTP ${response.status}: ${response.statusText}`,
              code: response.status.toString()
          };
      }
      
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  try {
      const data = await response.json();
      return data as ApiResponse<T>;
  } catch (error) {
      return { success: true } as unknown as ApiResponse<T>;
  }
};

const fetchWithAuth = async (url: string, options: RequestInit): Promise<Response> => {
    const response = await fetch(url, options);
    return response;
};

export const api = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
      try {
          const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
              method: 'GET',
              headers: createHeaders(),
              cache: 'no-cache'
          });
          return handleResponse<T>(response);
      } catch (error) {
          throw new Error(`Network error during GET request: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
  },
  
  post: async <T, U>(endpoint: string, data: U): Promise<ApiResponse<T>> => {
      try {
          const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
              method: 'POST',
              headers: createHeaders(),
              body: JSON.stringify(data)
          });
          return handleResponse<T>(response);
      } catch (error) {
          throw new Error(`Network error during POST request: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
  },

  put: async <T, U>(endpoint: string, data: U): Promise<ApiResponse<T>> => {
      try {
          const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
              method: 'PUT',
              headers: createHeaders(),
              body: JSON.stringify(data)
          });
          return handleResponse<T>(response);
      } catch (error) {
          throw new Error(`Network error during PUT request: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
      try {
          const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
              method: 'DELETE',
              headers: createHeaders()
          });
          return handleResponse<T>(response);
      } catch (error) {
          throw new Error(`Network error during DELETE request: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
  },

  postFormData: async <T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> => {
      try {
          const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
              method: 'POST',
              headers: getAuthHeader(),
              body: formData
          });
          return handleResponse<T>(response);
      } catch (error) {
          throw new Error(`Network error during FormData POST request: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
  }
};