import { ref } from "vue";

export function useDataProcessor() {
  const burgers = ref([]);
  const restaurants = ref([]);
  const isLoading = ref(false); // 🆕 loading state
  const error = ref(null); // 🆕 error state

  const loadData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const [burgersResponse, restaurantsResponse] = await Promise.all([
        fetch("/api/burgers"),
        fetch("/api/restaurants"),
      ]);

      if (!burgersResponse.ok) {
        throw new Error(
          `Failed to fetch burgers: ${burgersResponse.status} ${burgersResponse.statusText}`
        );
      }
      if (!restaurantsResponse.ok) {
        throw new Error(
          `Failed to fetch restaurants: ${restaurantsResponse.status} ${restaurantsResponse.statusText}`
        );
      }

      const burgersData = await burgersResponse.json();
      const restaurantsData = await restaurantsResponse.json();

      burgers.value = burgersData.data;
      restaurants.value = restaurantsData.data;

      // ✨ Keep saving to localStorage for now
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