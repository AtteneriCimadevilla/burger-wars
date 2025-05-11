// src/composables/useUser.js
import { ref } from "vue";

const user = ref(null); // Contendrá el objeto del usuario autenticado
const token = ref(null); // El JWT

export function useUser() {
  const isAuthenticated = () => !!token.value;

  const setUserFromToken = async (jwt) => {
    try {
      token.value = jwt;
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) throw new Error("Invalid token");

      user.value = await response.json();
    } catch (error) {
      console.error("Error decoding user token:", error);
      logout();
    }
  };

  const login = async ({ email, password }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const { token: jwt } = await response.json();
      localStorage.setItem("jwt", jwt);
      await setUserFromToken(jwt);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("jwt");
  };

  const init = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setUserFromToken(jwt);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    init,
    setUserFromToken,
  };
}
