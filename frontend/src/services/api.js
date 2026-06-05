const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'vmais_admin_token';
const ADMIN_KEY = 'vmais_admin_profile';
const EXPIRES_AT_KEY = 'vmais_admin_expires_at';
const SESSION_EXPIRED_MESSAGE = 'Sua sessao expirou. Faca login novamente.';

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getExpiresAt() {
    return localStorage.getItem(EXPIRES_AT_KEY);
  },
  getAdmin() {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setSession(session) {
    localStorage.setItem(TOKEN_KEY, session.token);
    if (session.expiresAt) {
      localStorage.setItem(EXPIRES_AT_KEY, session.expiresAt);
    }
    localStorage.setItem(ADMIN_KEY, JSON.stringify(session.admin));
  },
  setAdmin(admin) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  },
  isExpired(bufferMs = 0) {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return false;
    return Date.parse(expiresAt) - bufferMs <= Date.now();
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  }
};

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'UNKNOWN', details = '' } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiRequest(path, options = {}) {
  if (path !== '/auth/login' && authStorage.getToken() && authStorage.isExpired()) {
    authStorage.clear();
    throw new ApiError(SESSION_EXPIRED_MESSAGE, {
      status: 401,
      code: 'AUTH'
    });
  }

  const token = authStorage.getToken();
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch (error) {
    throw new ApiError('Nao foi possivel conectar com a API. Verifique se backend e CORS estao configurados.', {
      code: 'NETWORK',
      details: error.message
    });
  }

  if (!response.ok) {
    const message = await response.text();
    const fallbackMessages = {
      400: 'Dados invalidos. Revise os campos e tente novamente.',
      401: SESSION_EXPIRED_MESSAGE,
      403: 'Acesso negado. Faca login novamente se o problema continuar.',
      404: 'Registro nao encontrado. Atualize a pagina e tente novamente.',
      500: 'Erro interno da API. Tente novamente em instantes.'
    };
    if (response.status === 401 || response.status === 403) {
      authStorage.clear();
    }
    throw new ApiError(message || fallbackMessages[response.status] || `Erro ${response.status}`, {
      status: response.status,
      code: response.status === 401 || response.status === 403 ? 'AUTH' : 'HTTP'
    });
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

export function validateSession() {
  return apiRequest('/auth/me');
}
