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
    <div v-if="currentBurger" class="burgerView">
        <div class="burgerMain">
            <div class="burgerHeader itemCard">
                <h3>{{ currentBurger.name }}</h3>
                <img :src="currentBurger.image" :alt="currentBurger.name">
                <p>{{ currentBurger.description }}</p>
                <StarRating :rating="currentBurger.rating" />
            </div>
            <div class="burgerDetails">
                <p>{{ currentBurger.amount }}g. {{ currentBurger.main_ingredient }}</p>
                <p>{{ currentBurger.bread }}</p>
                <p>with {{ currentBurger.ingredients }}</p>
                <p>Price: {{ currentBurger.price }} €</p>
                <p>Taste rating: {{ currentBurger.ratings.taste }}</p>
                <p>Presentation rating: {{ currentBurger.ratings.presentation }}</p>
                <p>Quality/price rating: {{ currentBurger.ratings.quality_price }}</p>
            </div>
        </div>
        <div v-if="currentRestaurant" class="restaurantInfo">
            <RouterLink :to="`/restaurant/${currentRestaurant.id}`">
                <img :src="currentRestaurant.image" :alt="currentRestaurant.name">
                <h3>{{ currentRestaurant.name }}</h3>
            </RouterLink>
        </div>
    </div>
    <div v-else class="error-message">
        <p>Burger not found</p>
    </div>
</template>

<style scoped>
.burgerView {
    width: 80%;
    margin: 0 auto;
}

.burgerMain {
    margin: 20px;
    display: grid;
    grid-template-columns: auto 1fr;

    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
}

.burgerHeader {
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    text-align: center;
    color: var(--accent-color-2);
    height: fit-content;
}

.burgerHeader img {
    max-width: 200px;
    border-radius: 10px;
}

.burgerDetails {
    display: flex;
    flex-direction: column;
    align-items: left;
    margin: 20px;
    max-width: 600px;
    border-radius: 10px;
    padding: 10px;
    color: var(--accent-color-2);
}

.burgerDetails p {
    margin: 5px;
    font-size: 0.8rem;
}

.restaurantInfo {
    margin: 20px;
    text-align: center;
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
    padding: 20px;
}

.restaurantInfo img {
    width: 150px;
    border-radius: 10px;
}

.error-message {
    margin: 20px;
    text-align: center;
    color: var(--accent-color-2);
}

@media only screen and (max-width: 500px) {
    .burgerMain {
        grid-template-columns: 1fr;
    }

    .burgerDetails {
        font-size: 4rem;
    }
}

@media only screen and (min-width: 1024px) {
    .burgerView {
        display: grid;
        grid-template-columns: 1fr auto;
    }

    .burgerHeader img {
        max-width: 300px;
    }

    .burgerDetails {
        font-size: 1rem;
    }

    .restaurantInfo img {
        width: 200px;
    }

}
</style>