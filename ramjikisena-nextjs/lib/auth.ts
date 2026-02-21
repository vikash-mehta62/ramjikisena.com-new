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

export const authApi = {
  // Login
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
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
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const res = await fetch(`${API_URL}/api/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) return null;

      const data = await res.json();
      return data.user;
    } catch (error) {
      return null;
    }
  },

  // Logout
  logout: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      return res.ok;
    } catch (error) {
      return false;
    }
  },

  // Save count
  saveCount: async (currentCount: number, totalCount: number, malaCount: number) => {
    try {
      const res = await fetch(`${API_URL}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
