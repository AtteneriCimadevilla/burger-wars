import { ref, computed } from "vue";

export function useRestaurants() {
  const burgers = ref([]);
  const restaurants = ref([]);
  const error = ref(null);
  const loading = ref(true);

  const processRestaurants = () => {
    burgers.value.forEach((burger) => {
      // Calculate rating from 0-5 scale
      burger.rating =
        Math.round(
          ((burger.taste_rating +
            burger.presentation_rating +
            burger.quality_price_rating) /
            3) *
            100
        ) / 100;
    });

    restaurants.value.forEach((restaurant) => {
      const restaurantBurgers = burgers.value.filter(
        (burger) => burger.restaurant_id === restaurant.id
      );
      const totalRating = restaurantBurgers.reduce(
        (sum, burger) => sum + burger.rating,
        0
      );
      restaurant.rating =
        restaurantBurgers.length > 0
          ? Math.round((totalRating / restaurantBurgers.length) * 100) / 100
          : 0;
    });
  };

  const sortedBurgers = computed(() =>
    [...burgers.value].sort((a, b) => b.rating - a.rating)
  );
  const sortedRestaurants = computed(() =>
    [...restaurants.value].sort((a, b) => b.rating - a.rating)
  );

  const loadRestaurants = async () => {
    try {
      const burgersResponse = await fetch("/api/burgers");
      const restaurantsResponse = await fetch("/api/restaurants");

      if (!burgersResponse.ok || !restaurantsResponse.ok) {
        throw new Error("Error loading data");
      }

      burgers.value = await burgersResponse.json();
      restaurants.value = await restaurantsResponse.json();
      processRestaurants();
    } catch (error_) {
      error.value = error_.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    burgers,
    restaurants,
    sortedBurgers,
    sortedRestaurants,
    error,
    loading,
    loadRestaurants,
  };
}
