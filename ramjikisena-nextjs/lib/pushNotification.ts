'use client';

/**
 * Get or generate a persistent unique device ID for guest/user tracking
 */
export const getOrCreateDeviceId = (): string => {
  if (typeof window === 'undefined') return '';

  let deviceId = localStorage.getItem('rjs_device_id');
  if (!deviceId) {
    // Generate a unique device ID
    deviceId = 'rjs_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
    localStorage.setItem('rjs_device_id', deviceId);
  }
  return deviceId;
};

/**
 * Register FCM device token with the backend (handles guest and authenticated user automatically)
 */
export const registerFCMToken = async (fcmToken: string, token: string | null = null) => {
  try {
    if (!fcmToken) return null;

    const deviceId = getOrCreateDeviceId();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
    const res = await fetch(`${apiUrl}/api/notifications/register-device`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        deviceId,
        fcmToken,
        platform: 'web'
      })
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('[PUSH CLIENT] Failed to register device token:', err?.message || err);
    return null;
  }
};

/**
 * Unlink user from device token on logout
 */
export const logoutFCMDevice = async () => {
  try {
    const deviceId = getOrCreateDeviceId();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
    const res = await fetch(`${apiUrl}/api/notifications/device/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ deviceId })
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('[PUSH CLIENT] Failed to logout device token:', err?.message || err);
    return null;
  }
};
