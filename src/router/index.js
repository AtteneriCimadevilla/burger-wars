import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import BurgerView from "../views/BurgerView.vue";
import RestaurantsView from "../views/RestaurantsView.vue";
import RestaurantView from "../views/RestaurantView.vue";
import ListOfBurgers from "../views/ListOfBurgers.vue";
import AboutUsView from "../views/AboutUsView.vue";
// Imports for views that are not yet implemented
// import ReviewsView from "../views/ReviewsView.vue";
// import ContactView from "../views/ContactView.vue";
// import LoginView from "@/views/LoginView.vue";
// import RegisterView from "@/views/RegisterView.vue";
// import ProtectedView from "@/views/ProtectedView.vue";
import * as authService from "@/services/authService";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/burgers", name: "burgers", component: ListOfBurgers },
  { path: "/burger/:id", name: "burger", component: BurgerView },
  { path: "/restaurants", name: "restaurants", component: RestaurantsView },
  { path: "/restaurant/:id", name: "restaurant", component: RestaurantView },
  { path: "/about", name: "about", component: AboutUsView },
  // Routes for views that are not yet implemented
  // { path: "/reviews", name: "reviews", component: ReviewsView },
  // { path: "/contact", name: "contact", component: ContactView },
  { path: "/:catchAll(.*)", redirect: "/" },
  // { path: "/login", name: "Login", component: LoginView },
  // { path: "/register", name: "Register", component: RegisterView },
  // {
  //   path: "/protected",
  //   name: "Protected",
  //   component: ProtectedView,
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: "/admin-only",
  //   name: "AdminOnly",
  //   component: AdminView,
  //   meta: { requiresAuth: true, requiresAdmin: true },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protect routes
router.beforeEach(async (to, from, next) => {
  const isLoggedIn = authService.isAuthenticated();
  const userRole = authService.getUserRole(); // You’ll need to store and fetch this securely

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: "Login" });
  } else if (to.meta.requiresAdmin && userRole !== "admin") {
    next({ name: "home" }); // Or show an error page
  } else {
    next();
  }
});


export default router;
