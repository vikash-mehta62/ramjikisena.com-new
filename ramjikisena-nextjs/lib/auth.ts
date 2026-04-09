// Authentication helper functions

export interface User {
  _id: string;
  username: string;
  name: string;
  city: string;
  contact: string;
  rank: number;
  currCount: number;
  totalCount: number;
  mala: number;
  role: string;
  about?: string;
  dob?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
  customJaapNames?: Array<{ id: string; label: string; chars: string[] }>;
  dailyCounts: Array<{
    date: string;
    count: number;
  }>;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
  redirect?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: User;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100';

// Helper to get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper to set token in localStorage
const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Helper to remove token from localStorage
const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Helper to get headers with token
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const authApi = {
  // Login
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Still try cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      // If login successful and token received, save it
      if (data.success && data.token) {
        setToken(data.token);
      }
      // Save user object for role-based checks
      if (data.success && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      
      return data;
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  // Register
  register: async (formData: {
    username: string;
    name: string;
    city: string;
    contact: string;
    password: string;
  }): Promise<RegisterResponse> => {
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Still try cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      // If registration successful and token received, save it
      if (data.success && data.token) {
        setToken(data.token);
      }
      if (data.success && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      
      return data;
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = getToken();
      // No token = not logged in, don't make API call
      if (!token) return null;

      const res = await fetch(`${API_URL}/api/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      // Only clear token on explicit 401 Unauthorized
      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('panditToken');
          localStorage.removeItem('pandit');
        }
        return null;
      }

      // For other errors (500, network, etc.) - don't logout, just return null
      if (!res.ok) return null;

      const data = await res.json();
      return data.user;
    } catch (error) {
      // Network error - don't logout user
      return null;
    }
  },

  // Logout
  logout: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/logout`, {
        method: 'GET',
        headers: getAuthHeaders(), // Send token in header
        credentials: 'include',
      });

      // Remove token from localStorage
      removeToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      
      return res.ok;
    } catch (error) {
      removeToken(); // Remove even on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      return false;
    }
  },

  // Save count
  saveCount: async (currentCount: number, totalCount: number, malaCount: number) => {
    try {
      const res = await fetch(`${API_URL}/api/save`, {
        method: 'POST',
        headers: getAuthHeaders(), // Send token in header
        credentials: 'include',
        body: JSON.stringify({ currentCount, totalCount, malaCount }),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },
};
