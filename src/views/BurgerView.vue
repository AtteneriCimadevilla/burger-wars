<script setup>
import { useRoute } from 'vue-router';
import { useBurger } from '@/composables';
import StarRating from '@/components/StarRating.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const route = useRoute();
const id = route.params.id;

const { burger, restaurant, error, loading, loadBurger } = useBurger(id);

loadBurger();

</script>

<template>
    <LoadingSpinner v-if="loading" />

    <div v-else-if="burger" class="burgerView">
        <div class="burgerMain">
            <div class="burgerHeader itemCard">
                <h3>{{ burger.name }}</h3>
                <img :src="burger.image" :alt="burger.name">
                <p>{{ burger.description }}</p>
                <StarRating :rating="burger.rating" />
            </div>
            <div class="burgerDetails">
                <p v-if="burger.amount">{{ burger.amount }}g. {{ burger.main_ingredient }}</p>
                <p v-else>{{ burger.main_ingredient }}</p>
                <p>{{ burger.bread }}</p>
                <p>with {{ burger.ingredients }}</p>
                <p>price: {{ burger.price }} €</p>
                <p>taste rating: {{ burger.taste_rating }}</p>
                <p>presentation rating: {{ burger.presentation_rating }}</p>
                <p>quality/price rating: {{ burger.quality_price_rating }}</p>
            </div>
        </div>
        <RouterLink :to="`/restaurant/${restaurant.id}`">
            <div v-if="restaurant" class="restaurantInfo">
                <img :src="restaurant.image" :alt="restaurant.name">
                <h3>{{ restaurant.name }}</h3>
            </div>
        </RouterLink>
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
.itemCard:hover {
    background-color: var(--background-color);
    img {
        border: none;
    }
}

.burgerHeader img {
    max-width: 200px;
    border-radius: 10px;
}

.burgerDetails {
    display: flex;
    flex-direction: column;
    align-items: left;
    margin: 40px 20px 10px 20px;
    max-width: 600px;
    border-radius: 10px;
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

.restaurantInfo:hover {
    background-color: var(--accent-color-1);
    img {
        border: 3px solid var(--accent-color-2);
    }
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
    .burgerHeader {
        margin-bottom: 0;
    }
    .burgerDetails {
        margin-top: 10px;
    }
    .burgerDetails>p {
        font-size: 0.7rem;
    }
}

@media only screen and (min-width: 1024px) {
    .burgerView {
        display: grid;
        grid-template-columns: 1fr auto;
    }
}
</style>