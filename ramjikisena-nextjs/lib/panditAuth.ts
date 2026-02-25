// Pandit Authentication Utilities

export const getPanditToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('panditToken');
};

export const getPanditInfo = () => {
  if (typeof window === 'undefined') return null;
  const panditData = localStorage.getItem('pandit');
  if (!panditData) return null;
  
  try {
    return JSON.parse(panditData);
  } catch (e) {
    return null;
  }
};

export const setPanditAuth = (token: string, pandit: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('panditToken', token);
  localStorage.setItem('pandit', JSON.stringify(pandit));
};

export const clearPanditAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('panditToken');
  localStorage.removeItem('pandit');
};

export const isPanditLoggedIn = (): boolean => {
  return !!getPanditToken();
};

// API call helper with pandit token
export const panditFetch = async (url: string, options: RequestInit = {}) => {
  const token = getPanditToken();
  
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
