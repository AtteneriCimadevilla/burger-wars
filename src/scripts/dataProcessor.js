import { ref, computed } from "vue";

export function useDataProcessor() {
  const burgers = ref([]);
  const restaurants = ref([]);

  const processData = () => {
    burgers.value.forEach((burger) => {
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
        (burger) => burger.restaurant === restaurant.id
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

  const loadData = async () => {
    try {
      const burgersResponse = await fetch("/api/burgers");
      const restaurantsResponse = await fetch("/api/restaurants");

      if (!burgersResponse.ok || !restaurantsResponse.ok) {
        throw new Error("Error loading data");
      }

      burgers.value = await burgersResponse.json();
      restaurants.value = await restaurantsResponse.json();
      processData();
      saveToLocalStorage();
      // console.log("Data loaded successfully");
      // console.log(burgers.value);
      // console.log(restaurants.value);
      
    } catch (error) {
      console.error("loadData error:", error);
    }
  };

  console.log("hola");

  const saveToLocalStorage = () => {
    localStorage.setItem("burgers", JSON.stringify(sortedBurgers.value));
    localStorage.setItem(
      "restaurants",
      JSON.stringify(sortedRestaurants.value)
    );
  };

  console.log(burgers.value);
  console.log(restaurants.value);
  

  return {
    burgers,
    restaurants,
    sortedBurgers,
    sortedRestaurants,
    loadData,
  };
}
