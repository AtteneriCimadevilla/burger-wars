import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import BurgerView from "../views/BurgerView.vue";
import RestaurantsView from "../views/RestaurantsView.vue";
import RestaurantView from "../views/RestaurantView.vue";
import ListOfBurgers from "../views/ListOfBurgers.vue";
import AboutUsView from "../views/AboutUsView.vue";
import ReviewsView from "../views/ReviewsView.vue";
import ContactView from "../views/ContactView.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/burgers", name: "burgers", component: ListOfBurgers },
  { path: "/burger/:id", name: "burger", component: BurgerView },
  { path: "/restaurants", name: "restaurants", component: RestaurantsView },
  { path: "/restaurant/:id", name: "restaurant", component: RestaurantView },
  { path: "/about", name: "about", component: AboutUsView },
  { path: "/reviews", name: "reviews", component: ReviewsView },
  { path: "/contact", name: "contact", component: ContactView },
  { path: "/:catchAll(.*)", redirect: "/" },
  { path: "/list", name: "list", component: ListOfBurgers },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
