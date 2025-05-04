import { ref } from "vue";

export function useDataProcessor() {
  const burgers = ref([]);
  const restaurants = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const loadData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const [burgersResult, restaurantsResult] = await Promise.allSettled([
        fetch("/api/burgers"),
        fetch("/api/restaurants"),
      ]);

      if (burgersResult.status === "fulfilled" && burgersResult.value.ok) {
        const burgersData = await burgersResult.value.json();
        burgers.value = burgersData.data || [];
      } else {
        console.error("Failed to load burgers:", burgersResult.reason);
      }

      if (
        restaurantsResult.status === "fulfilled" &&
        restaurantsResult.value.ok
      ) {
        const restaurantsData = await restaurantsResult.value.json();
        restaurants.value = restaurantsData.data || [];
      } else {
        console.error("Failed to load restaurants:", restaurantsResult.reason);
      }
      
      saveToLocalStorage();

      console.log("Data loaded successfully");
    } catch (err) {
      console.error("Error loading data:", err);
      error.value = err.message || "Unknown error";
    } finally {
      isLoading.value = false;
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("burgers", JSON.stringify(burgers.value));
    localStorage.setItem("restaurants", JSON.stringify(restaurants.value));
  };

  return {
    burgers,
    restaurants,
    isLoading,
    error,
    loadData,
  };
}
