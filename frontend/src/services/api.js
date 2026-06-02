const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'vmais_admin_token';
const ADMIN_KEY = 'vmais_admin_profile';

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getAdmin() {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setSession(session) {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(session.admin));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  }
};

export async function apiRequest(path, options = {}) {
  const token = authStorage.getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}
