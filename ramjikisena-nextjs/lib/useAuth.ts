'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100';

interface AuthUser {
  _id: string;
  name: string;
  username: string;
  city?: string;
  role?: string;
  rank?: number;
  totalCount?: number;
  mala?: number;
  profileImage?: string;
  [key: string]: any;
}

/**
 * useAuth - Central auth hook for all protected pages
 * - Reads from localStorage first (instant)
 * - Verifies with API in background
 * - Only redirects on explicit 401
 * - Never clears token on network errors
 */
export function useAuth(options: { redirectTo?: string; requireAuth?: boolean } = {}) {
  const { redirectTo = '/login', requireAuth = true } = options;
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      if (requireAuth) router.push(redirectTo);
      else setLoading(false);
      return;
    }

    // Step 1: Load from localStorage immediately
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const cached = JSON.parse(userStr);
        setUser(cached);
        setLoading(false); // Show page immediately with cached data
      } catch {}
    }

    // Step 2: Verify with API in background
    fetch(`${API_URL}/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 401) {
          // Token truly expired/invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (requireAuth) router.push(redirectTo);
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then(data => {
        if (data?.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        setVerified(true);
        setLoading(false);
      })
      .catch(() => {
        // Network error - keep user logged in
        setVerified(true);
        setLoading(false);
      });
  }, []);

  return { user, loading, verified };
}
