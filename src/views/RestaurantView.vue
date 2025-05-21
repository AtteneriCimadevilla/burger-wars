<script setup>
import { useRoute } from 'vue-router';
import { useRestaurant } from '@/composables';
import StarRating from '../components/StarRating.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const route = useRoute();
const id = route.params.id;

const { restaurant, sortedBurgers, error, loading, loadRestaurant } = useRestaurant(id);

loadRestaurant();
</script>

<template>
    <LoadingSpinner v-if="loading" />

    <div v-else-if="restaurant" class="restaurant-details">
        <div class="restaurantHeader">
            <img class="miniLogo" :src="restaurant.image" alt="restaurant.name">
            <h3>{{ restaurant.name }}</h3>
            <a :href="restaurant.website" class="link">{{ restaurant.website }}</a>
            <iframe :src="restaurant.url" frameborder="0" class="map"></iframe>
            <p>{{ restaurant.address }}</p>
        </div>

        <div v-if="sortedBurgers.length" class="itemsList">
            <div v-for="burger in sortedBurgers" :key="burger.id" class="itemCard">
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