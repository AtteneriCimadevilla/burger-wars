import { ref } from "vue";
import { useRestaurant } from "./useRestaurant";

export function useBurger(id) {
  const burger = ref(null);
  const restaurant = ref(null);
  const error = ref(null);
  const loading = ref(true);

  const {
    restaurant: restaurantData,
    loadRestaurant,
    error: restaurantError,
  } = useRestaurant();

  const loadBurger = async () => {
    try {
      const burgerResponse = await fetch(`/api/burgers?id=${id}`);
      if (!burgerResponse.ok) throw new Error("Failed to fetch burger");

      const burgerData = await burgerResponse.json();
      burger.value = burgerData;

      const restaurant_id = burgerData.restaurant_id;
      await loadRestaurant(restaurant_id);

      restaurant.value = restaurantData.value;

      if (restaurantError.value) {
        throw new Error(restaurantError.value);
      }
    } catch (error_) {
      error.value = error_.message;
    } finally {
      loading.value = false;
    }
  };

  return { burger, restaurant, error, loading, loadBurger };
}
