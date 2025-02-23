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
                    <StarRating :rating="burger.rating" :maxrating="10" />
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
    height: 290px;
    @media only screen and (max-width: 550px) {
        height: 200px;
    }
}
</style>