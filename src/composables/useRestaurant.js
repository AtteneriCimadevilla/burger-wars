import { ref, computed } from "vue";

export function useRestaurant(static_id = null) {
  const burgers = ref([]);
  const restaurant = ref(null);
  const error = ref(null);
  const loading = ref(true);

  const loadRestaurant = async (dynamic_id) => {
    const id = dynamic_id || static_id;
    if (!id) throw new Error("No restaurant ID provided");

    try {
      const burgersResponse = await fetch(`/api/burgers?restaurant_id=${id}`);
      const restaurantResponse = await fetch(`/api/restaurants?id=${id}`);

      if (!burgersResponse.ok || !restaurantResponse.ok) {
        throw new Error("Failed to load data.");
      }

      burgers.value = await burgersResponse.json();
      restaurant.value = await restaurantResponse.json();

      // Calculate restaurant rating from burger ratings
      processRestaurant();
    } catch (error_) {
      error.value = error_.message;
    } finally {
      loading.value = false;
    }
  };

  const processRestaurant = () => {
    // Burgers now come with calculated ratings from the API
    // Just calculate the restaurant's overall rating
    const totalRating = burgers.value.reduce(
      (sum, burger) => sum + burger.rating,
      0
    );
    restaurant.value.rating =
      burgers.value.length > 0
        ? Math.round((totalRating / burgers.value.length) * 100) / 100
        : 0;
  };

  const sortedBurgers = computed(() =>
    [...burgers.value].sort((a, b) => b.rating - a.rating)
  );

  return { burgers, sortedBurgers, restaurant, error, loading, loadRestaurant };
}
