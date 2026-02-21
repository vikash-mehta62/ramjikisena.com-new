const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100';

// Helper to get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper to get headers with token
const getAuthHeaders = (isFormData: boolean = false): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = isFormData ? {} : {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const api = {
  get: async (url: string) => {
    const res = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return res;
  },

  post: async (url: string, data?: any, options?: RequestInit) => {
    const isFormData = data instanceof FormData;
    
    const res = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: getAuthHeaders(isFormData),
      credentials: 'include',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      ...options
    });
    return res;
  },

  put: async (url: string, data?: any) => {
    const res = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });
    return res;
  },

  delete: async (url: string) => {
    const res = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return res;
  },

  // Auth endpoints
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
    return res;
  },

  register: async (data: {
    username: string;
    name: string;
    city: string;
    contact: string;
    password: string;
  }) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res;
  },

  logout: async () => {
    const res = await fetch(`${API_URL}/logout`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return res;
  },

  // User endpoints
  getProfile: async () => {
    const res = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return res;
  },

  saveCount: async (currentCount: number, totalCount: number, malaCount: number) => {
    const res = await fetch(`${API_URL}/save`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ currentCount, totalCount, malaCount }),
    });
    return res;
  },

  getAllDevotees: async () => {
    const res = await fetch(`${API_URL}/allDevotees`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return res;
  },

  searchUser: async (name: string) => {
    const res = await fetch(`${API_URL}/user/${name}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return res;
  },

  getLekhanHistory: async () => {
    const res = await fetch(`${API_URL}/lekhanHistory`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return res;
  },

  // Stats
  getStats: async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'GET',
    });
    return res;
  },
};

export default api;
