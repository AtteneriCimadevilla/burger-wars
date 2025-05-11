import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "jwt_token";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function deleteToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  deleteToken();
}

export async function login(credentials) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) return false;

    const data = await response.json();
    saveToken(data.token);
    return true;
  } catch (err) {
    console.error("Login failed", err);
    return false;
  }
}

// Fetch wrapper with Authorization header
export async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    logout(); // Token might be invalid or expired
  }

  return response;
}

export function getUser() {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Error decoding user token:", err);
    return null;
  }
}

export function getUserRole() {
  const user = getUser();
  return user?.role || "user";
}
