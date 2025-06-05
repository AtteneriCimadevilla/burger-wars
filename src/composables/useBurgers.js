import { ref, computed } from "vue";

export function useBurgers() {
  const burgers = ref([]);
  const error = ref(null);
  const loading = ref(true);

  // No need to process burgers here anymore since ratings come from API
  const sortedBurgers = computed(() =>
    [...burgers.value].sort((a, b) => b.rating - a.rating)
  );

  const loadBurgers = async () => {
    try {
      const burgersResponse = await fetch("/api/burgers");

      if (!burgersResponse.ok) {
        throw new Error("Failed to fetch burgers");
      }

      burgers.value = await burgersResponse.json();
      // Ratings are now calculated in the API, no processing needed here
    } catch (error_) {
      error.value = error_.message;
    } finally {
      loading.value = false;
    }
  };

  return { burgers, sortedBurgers, error, loading, loadBurgers };
}
