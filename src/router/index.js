import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import BurgerView from "../views/BurgerView.vue";
import RestaurantsView from "../views/RestaurantsView.vue";
import RestaurantView from "../views/RestaurantView.vue";
import ListOfBurgers from "../views/ListOfBurgers.vue";
import AboutUsView from "../views/AboutUsView.vue";

// import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ProfileView from "../views/ProfileView.vue";
import ReviewsView from "../views/ReviewsView.vue";

import * as authService from "@/services/authService";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/burgers", name: "burgers", component: ListOfBurgers },
  { path: "/burger/:id", name: "burger", component: BurgerView },
  { path: "/restaurants", name: "restaurants", component: RestaurantsView },
  { path: "/restaurant/:id", name: "restaurant", component: RestaurantView },
  { path: "/about", name: "about", component: AboutUsView },

  // { path: "/contact", name: "contact", component: ContactView },
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  { path: "/reviews", name: "reviews", component: ReviewsView },
  { path: "/:catchAll(.*)", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protect routes
router.beforeEach(async (to, from, next) => {
  const isLoggedIn = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: "login" });
  } else if (to.meta.requiresAdmin && userRole !== "admin") {
    next({ name: "home" });
  } else {
    next();
  }
});


export default router;
