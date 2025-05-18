<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDataProcessor } from '../scripts/dataProcessor';
import StarRating from '../components/StarRating.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const route = useRoute();
const { restaurants, burgers, loadData } = useDataProcessor();

const currentRestaurant = computed(() => {
    return restaurants.value?.find(r => r.id === route.params.id) || null
})

const currentRestaurantBurgers = computed(() => {
    if (!burgers.value) return []
    return burgers.value.filter(burger => burger.restaurant_id === route.params.id)
})

// Loading state
const loading = ref(true)

onMounted(async () => {
    await loadData();
    loading.value = false;
})
</script>

<template>
    <LoadingSpinner v-if="loading" />

    <div v-else-if="currentRestaurant" class="restaurant-details">
        <div class="restaurantHeader">
            <img class="miniLogo" :src="currentRestaurant.image" alt="currentRestaurant.name">
            <h3>{{ currentRestaurant.name }}</h3>
            <a :href="currentRestaurant.website" class="link">{{ currentRestaurant.website }}</a>
            <iframe :src="currentRestaurant.url" frameborder="0" class="map"></iframe>
            <p>{{ currentRestaurant.address }}</p>
        </div>

        <div v-if="currentRestaurantBurgers.length" class="itemsList">
            <div v-for="burger in currentRestaurantBurgers" :key="burger.id" class="itemCard">
                <RouterLink :to="`/burger/${burger.id}`" class="itemLink">
                    <h3 class="itemName">{{ burger.name }}</h3>
                    <img :src="burger.image" alt="burger.name">
                    <StarRating :rating="burger.rating" :maxrating="5" />
                </RouterLink>
            </div>
        </div>
        <div v-else class="error-message">
            <p>No burgers from this restaurant yet.</p>
        </div>
    </div>
    <div v-else class="error-message">
        <p>Restaurant not found</p>
    </div>
</template>

<style scoped>
.error-message {
    margin: 20px;
    text-align: center;
    color: var(--accent-color-2);
}

.restaurantHeader {
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    text-align: center;
    color: var(--accent-color-2);
}
.miniLogo {
    width: 70px;
    border-radius: 10%;
    margin-bottom: 10px;
}
.link {
    margin-top: 5px;
}
.map {
    margin: 10px;
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
}
.itemCard {
    height: 295px;
    @media only screen and (max-width: 550px) {
        height: 200px;
    }
}
</style>