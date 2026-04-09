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
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Handle 401 - clear token and redirect to login
const handle401 = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Only redirect if not already on login/register page
  const path = window.location.pathname;
  if (!path.includes('/login') && !path.includes('/register') && !path.includes('/forgot')) {
    window.location.href = '/login';
  }
};

// Wrapper that checks for 401 on protected routes
const safeFetch = async (url: string, options: RequestInit): Promise<Response> => {
  const res = await fetch(`${API_URL}${url}`, options);
  if (res.status === 401) {
    handle401();
  }
  return res;
};

const api = {
  get: async (url: string) => {
    return safeFetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
  },

  post: async (url: string, data?: any, options?: RequestInit) => {
    const isFormData = data instanceof FormData;
    return safeFetch(url, {
      method: 'POST',
      headers: getAuthHeaders(isFormData),
      credentials: 'include',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      ...options,
    });
  },

  put: async (url: string, data?: any) => {
    return safeFetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch: async (url: string, data?: any) => {
    return safeFetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete: async (url: string) => {
    return safeFetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
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
