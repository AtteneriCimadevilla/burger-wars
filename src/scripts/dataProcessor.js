import { ref, computed } from 'vue'

export function useDataProcessor() {
  const burgers = ref([])
  const restaurants = ref([])

  const processData = () => {
    burgers.value.forEach(burger => {
      burger.rating = Math.round((burger.ratings.taste + burger.ratings.presentation + burger.ratings.quality_price) / 3 * 100) / 100
    })

    restaurants.value.forEach((restaurant) => {
      const restaurantBurgers = burgers.value.filter(burger => burger.restaurant === restaurant.id)
      const totalRating = restaurantBurgers.reduce((sum, burger) => sum + burger.rating, 0)
      restaurant.rating = restaurantBurgers.length > 0 ? Math.round((totalRating / restaurantBurgers.length) * 100) / 100 : 0
    })
  }

  const sortedBurgers = computed(() => [...burgers.value].sort((a, b) => b.rating - a.rating))
  const sortedRestaurants = computed(() => [...restaurants.value].sort((a, b) => b.rating - a.rating))

  const loadData = async () => {
    const burgersModule = await import('../assets/data/burgers.json')
    const restaurantsModule = await import('../assets/data/restaurants.json')
    burgers.value = burgersModule.default
    restaurants.value = restaurantsModule.default
    processData()
    saveToLocalStorage()
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('burgers', JSON.stringify(sortedBurgers.value))
    localStorage.setItem('restaurants', JSON.stringify(sortedRestaurants.value))
  }

  return {
    burgers,
    restaurants,
    sortedBurgers,
    sortedRestaurants,
    loadData
  }
}