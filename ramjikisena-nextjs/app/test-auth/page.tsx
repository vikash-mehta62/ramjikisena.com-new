'use client';

import { useState, useEffect } from 'react';

export default function TestAuthPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loginResult, setLoginResult] = useState<any>(null);
  const [meResult, setMeResult] = useState<any>(null);

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const testLogin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: 'test',
          password: 'test123'
        }),
      });

      const data = await res.json();
      setLoginResult(data);

      // Save token if received
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
    } catch (error: any) {
      setLoginResult({ error: error.message });
    }
  };

  const testMe = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: any = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      const data = await res.json();
      setMeResult(data);
    } catch (error: any) {
      setMeResult({ error: error.message });
    }
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    setToken(null);
    setLoginResult(null);
    setMeResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>

        {/* Token Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Token Status</h2>
          <div className="space-y-2">
            <p><strong>Token in localStorage:</strong></p>
            {token ? (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm font-mono break-all">{token.substring(0, 50)}...</p>
              </div>
            ) : (
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <p className="text-sm">No token found</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={testLogin}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Test Login
            </button>
            <button
              onClick={testMe}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Test /api/me
            </button>
            <button
              onClick={clearToken}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Clear Token
            </button>
          </div>
        </div>

        {/* Login Result */}
        {loginResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Login Result</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(loginResult, null, 2)}
            </pre>
          </div>
        )}

        {/* /api/me Result */}
        {meResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">/api/me Result</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(meResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold mb-2">How to Test:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click "Test Login" - should return success with token</li>
            <li>Check "Token Status" - should show token</li>
            <li>Click "Test /api/me" - should return user data</li>
            <li>Open DevTools → Network tab to see headers</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
