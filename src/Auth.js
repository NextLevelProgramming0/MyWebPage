import { variables } from './Variables';

const ACCESS_TOKEN_KEY = 'mywebpage_access_token';
const REFRESH_TOKEN_KEY = 'mywebpage_refresh_token';

export const isAuthenticated = () => Boolean(sessionStorage.getItem(ACCESS_TOKEN_KEY));

export const saveTokens = ({ access, refresh }) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, access);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const clearTokens = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

const refreshAccessToken = async () => {
  const refresh = sessionStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refresh) return null;

  const response = await fetch(variables.API_URL + 'auth/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh })
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = await response.json();
  sessionStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  return data.access;
};

export const authFetch = async (url, options = {}) => {
  const headers = new Headers(options.headers || {});
  const access = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (access) headers.set('Authorization', `Bearer ${access}`);

  let response = await fetch(url, { ...options, headers });
  if (response.status !== 401) return response;

  const refreshedAccess = await refreshAccessToken();
  if (!refreshedAccess) {
    window.dispatchEvent(new Event('auth-expired'));
    return response;
  }

  headers.set('Authorization', `Bearer ${refreshedAccess}`);
  response = await fetch(url, { ...options, headers });
  return response;
};
