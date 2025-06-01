"use client";

import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const user = ref(null);
const token = ref(localStorage.getItem("jwt_token"));
const loading = ref(false);
const error = ref(null);

export default function useAuth() {
  const router = useRouter();

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  const setAuthData = (authToken, userData) => {
    token.value = authToken;
    user.value = userData;
    localStorage.setItem("jwt_token", authToken);
    console.log("Auth data set:", { token: authToken, user: userData });
  };

  const clearAuthData = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("jwt_token");
    console.log("Auth data cleared");
  };

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    console.log("Login attempt with:", credentials);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setAuthData(data.token, data.user);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    console.log("Register attempt with:", userData);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("Register response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setAuthData(data.token, data.user);
      router.push({ name: "home" });
      return true;
    } catch (err) {
      console.error("Register error:", err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    clearAuthData();
  };

  const fetchUser = async () => {
    const storedToken = localStorage.getItem("jwt_token");
    if (!storedToken) {
      console.log("No token found in localStorage");
      return;
    }

    console.log("Fetching user with token");

    try {
      const response = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      console.log("Fetch user response status:", response.status);

      if (!response.ok) {
        console.log("Failed to fetch user, clearing auth data");
        clearAuthData();
        return;
      }

      const userData = await response.json();
      console.log("User data fetched:", userData);

      token.value = storedToken;
      user.value = userData;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      clearAuthData();
    }
  };

  // Initialize auth state
  const init = async () => {
    console.log("Initializing auth state");
    await fetchUser();
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
    init,
  };
}
