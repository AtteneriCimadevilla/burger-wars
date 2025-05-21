import { ref, computed } from "vue";

export function useBurgers() {
  const burgers = ref([]);
  const error = ref(null);
  const loading = ref(true);

  const processBurgers = () => {
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
  };

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
      processBurgers();
    } catch (error_) {
      error.value = error_.message;
    } finally {
      loading.value = false;
    }
  };

  return { burgers, sortedBurgers, error, loading, loadBurgers };
}
