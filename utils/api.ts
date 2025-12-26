
const API_URL = '/api';

const getAuthHeader = () => {
  const userStr = localStorage.getItem('yapee_user');
  if (userStr) {
      const user = JSON.parse(userStr);
      if (user.token) {
          return { 'Authorization': `Bearer ${user.token}` };
      }
  }
  return {};
};

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  },

  put: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  },

  delete: async (endpoint: string) => {
      const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'DELETE',
          headers: { ...getAuthHeader() }
      });
      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      return res.json();
  }
};
