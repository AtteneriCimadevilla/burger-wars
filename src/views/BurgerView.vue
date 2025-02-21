<script>
import StarRating from '@/components/StarRating.vue';
import { RouterLink } from 'vue-router';

export default {
    name: 'BurgerView',
    components: {
        StarRating
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            burgers: JSON.parse(localStorage.getItem('burgers') || '[]'),
            restaurants: JSON.parse(localStorage.getItem('restaurants') || '[]')
        }
    },
    computed: {
        currentBurger() {
            return this.burgers.find(burger => burger.id === this.$route.params.id) || null;
        },
        currentRestaurant() {
            return this.currentBurger
                ? this.restaurants.find(restaurant => restaurant.id === this.currentBurger.restaurant)
                : null;
        }
    }
}
</script>

<template>
    <div v-if="currentBurger">
        <div class="burgerMain">
            <div class="burgerHeader">
                <h3>{{ currentBurger.name }}</h3>
                <img :src="currentBurger.image" :alt="currentBurger.name">
                <p>{{ currentBurger.description }}</p>
                <StarRating :rating="currentBurger.rating" />
            </div>
            <div class="burgerDetails">
                <p>paragraph</p>
            </div>
        </div>
        <div v-if="currentRestaurant" class="restaurantInfo">
            <RouterLink :to="`/restaurant/${currentRestaurant.id}`">
                <h4>{{ currentRestaurant.name }}</h4>
                <img :src="currentRestaurant.image" :alt="currentRestaurant.name">
            </RouterLink>
        </div>
    </div>
    <div v-else class="error-message">
        <p>Burger not found</p>
    </div>
</template>

<style scoped>
.burgerMain {
    margin: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
}
.burgerHeader {
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    text-align: center;
    color: var(--accent-color-2);
}
.burgerHeader img {
    max-width: 200px;
    border-radius: 10px;
}

.burgerDetails {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.restaurantInfo {
    margin-top: 20px;
    text-align: center;
}
.restaurantInfo img {
    width: 150px;
}

.error-message {
    margin: 20px;
    text-align: center;
    color: var(--accent-color-2);
}
</style>