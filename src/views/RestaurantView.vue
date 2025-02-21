<script>
import StarRating from '@/components/StarRating.vue';

export default {
    props: ['id'],
    data() {
        return {
            restaurants: JSON.parse(localStorage.getItem('restaurants') || '[]'),
            burgers: JSON.parse(localStorage.getItem('burgers') || '[]')
        }
    },
    components: {
        StarRating
    },
    computed: {
        currentRestaurant() {
            return this.restaurants.find(restaurant => restaurant.id === this.$route.params.id) || null;
        },
        currentRestaurantBurgers() {
            return this.burgers.filter(burger => burger.restaurant === this.$route.params.id) || null;
        },
    },
}
</script>

<template>
    <div v-if="currentRestaurant" class="restaurant-details">
        <div class="restaurantHeader">
            <h3>{{ currentRestaurant.name }}</h3>
            <p>{{ currentRestaurant.description }}</p>
            <iframe :src="currentRestaurant.url" frameborder="0"></iframe>
        </div>

        <div class="itemsList">
            <div v-for="burger in currentRestaurantBurgers" :key="burger.id" class="itemCard">
                <RouterLink :to="`/burger/${burger.id}`">
                    <h3>{{ burger.name }}</h3>
                    <img :src="burger.image" alt="burger.name">
                    <StarRating :rating="burger.rating" :maxrating="10"/>
                </RouterLink>
            </div>
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
</style>