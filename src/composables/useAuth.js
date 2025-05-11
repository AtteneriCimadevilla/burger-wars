import { ref } from "vue";
import * as authService from "@/services/authService";
import { useRouter } from "vue-router";

const user = ref(null);
const isAuthenticated = ref(authService.isAuthenticated());

export default function useAuth() {
  const router = useRouter();

  const login = async (credentials) => {
    const success = await authService.login(credentials);
    if (success) {
      user.value = authService.getUser();
      isAuthenticated.value = true;
      router.push({ name: "home" });
    }
  };

  const logout = () => {
    authService.logout();
    user.value = null;
    isAuthenticated.value = false;
    router.push({ name: "Login" });
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}
