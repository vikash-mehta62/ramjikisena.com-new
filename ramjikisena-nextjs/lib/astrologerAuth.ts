// Astrologer & Tarot Reader Authentication Utilities

export const getAstrologerToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('astrologerToken');
};

export const getAstrologerInfo = () => {
  if (typeof window === 'undefined') return null;
  const astrologerData = localStorage.getItem('astrologer');
  if (!astrologerData) return null;

  try {
    return JSON.parse(astrologerData);
  } catch (e) {
    return null;
  }
};

export const setAstrologerAuth = (token: string, astrologer: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('astrologerToken', token);
  localStorage.setItem('astrologer', JSON.stringify(astrologer));
  window.dispatchEvent(new Event('auth-change'));
};

export const clearAstrologerAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('astrologerToken');
  localStorage.removeItem('astrologer');
  window.dispatchEvent(new Event('auth-change'));
};

export const isAstrologerLoggedIn = (): boolean => {
  return !!getAstrologerToken();
};

// API call helper with astrologer token
export const astrologerFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAstrologerToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};
