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
      const [burgersResponse, restaurantsResponse] = await Promise.all([
        fetch("/api/burgers"),
        fetch("/api/restaurants"),
      ]);

      // Check if response is actually OK (ignore 404 for HEAD requests)
      if (!burgersResponse.ok && burgersResponse.status !== 404) {
        throw new Error(`Failed to fetch burgers: ${burgersResponse.status}`);
      }
      if (!restaurantsResponse.ok && restaurantsResponse.status !== 404) {
        throw new Error(
          `Failed to fetch restaurants: ${restaurantsResponse.status}`
        );
      }

      const burgersData = await burgersResponse.json();
      const restaurantsData = await restaurantsResponse.json();

      burgers.value = burgersData.data || [];
      restaurants.value = restaurantsData.data || [];

      // saveToLocalStorage();

      console.log("✅ Data loaded successfully");
    } catch (err) {
      console.error("❌ Error loading data:", err);
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
