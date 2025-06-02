<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useBurger } from '@/composables';
import StarRating from '@/components/StarRating.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ReviewForm from '@/components/ReviewForm.vue';
import ReviewsComponent from '@/components/ReviewsComponent.vue';

const route = useRoute();
const id = route.params.id;

const reviews = ref([]);
const reviewsLoading = ref(true);
const reviewsError = ref('');

const { burger, restaurant, error, loading, loadBurger } = useBurger(id);

// Convert 1-10 scale to 0-5 scale for display
const burgerRating = computed(() => {
    if (!burger.value) return 0;
    const avg = (burger.value.taste_rating + burger.value.presentation_rating + burger.value.quality_price_rating) / 3;
    return avg / 2; // Convert to 5-star scale
});

const loadReviews = async () => {
    try {
        const response = await fetch(`/api/reviews?burger_id=${id}`);

        if (!response.ok) {
            throw new Error('Failed to load reviews');
        }

        const data = await response.json();
        reviews.value = data;
    } catch (err) {
        reviewsError.value = err.message;
    } finally {
        reviewsLoading.value = false;
    }
};

const handleReviewSubmitted = () => {
    // Reload reviews after a new one is submitted
    loadReviews();
    // Also reload burger to update ratings
    loadBurger();
};

const handleReviewUpdated = (updatedReview) => {
    const index = reviews.value.findIndex(r => r.id === updatedReview.id);
    if (index !== -1) {
        reviews.value[index] = {
            ...reviews.value[index],
            ...updatedReview
        };
    }
    // Also reload burger to update ratings
    loadBurger();
};

onMounted(async () => {
    await loadBurger();
    await loadReviews();
});
</script>

<template>
    <LoadingSpinner v-if="loading" />

    <div v-else-if="burger" class="burgerView">
        <div class="burgerMain">
            <div class="burgerHeader itemCard">
                <h3>{{ burger.name }}</h3>
                <img :src="burger.image" :alt="burger.name">
                <p>{{ burger.description }}</p>
                <div class="burger-rating">
                    <StarRating :rating="burgerRating" :maxRating="5" />
                    <span class="rating-value">{{ Math.round(burgerRating * 10) / 10 }}/5</span>
                </div>
            </div>
            <div class="burgerDetails">
                <p v-if="burger.amount">{{ burger.amount }}g. {{ burger.main_ingredient }}</p>
                <p v-else>{{ burger.main_ingredient }}</p>
                <p>{{ burger.bread }}</p>
                <p>with {{ burger.ingredients }}</p>
                <p>price: {{ burger.price }} €</p>
                <div class="ratings-breakdown">
                    <p>Taste:
                        <StarRating :rating="burger.taste_rating / 2" :maxRating="5" />
                    </p>
                    <p>Presentation:
                        <StarRating :rating="burger.presentation_rating / 2" :maxRating="5" />
                    </p>
                    <p>Quality/Price:
                        <StarRating :rating="burger.quality_price_rating / 2" :maxRating="5" />
                    </p>
                </div>
            </div>
        </div>

        <RouterLink :to="`/restaurant/${restaurant.id}`">
            <div v-if="restaurant" class="restaurantInfo">
                <img :src="restaurant.image" :alt="restaurant.name">
                <h3>{{ restaurant.name }}</h3>
            </div>
        </RouterLink>

        <!-- Reviews Section -->
        <div class="reviews-container">
            <h2>Reviews</h2>

            <ReviewForm :burgerId="id" @submitted="handleReviewSubmitted" />

            <div v-if="reviewsLoading" class="loading">Loading reviews...</div>
            <div v-else-if="reviewsError" class="error">{{ reviewsError }}</div>
            <ReviewsComponent v-else :reviews="reviews" :showBurgerInfo="false" :canEdit="true"
                @reviewUpdated="handleReviewUpdated" />
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

.burger-rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.5rem;
}

.rating-value {
    margin-top: 0.25rem;
    font-weight: 600;
    color: var(--accent-color-2);
}

.itemCard:hover {
    background-color: var(--background-color);
}

.itemCard:hover img {
    border: none;
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

.ratings-breakdown {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.ratings-breakdown p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.restaurantInfo {
    margin: 20px;
    text-align: center;
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.restaurantInfo:hover {
    background-color: var(--accent-color-1);
}

.restaurantInfo:hover img {
    border: 3px solid var(--accent-color-2);
}

.restaurantInfo img {
    width: 150px;
    border-radius: 10px;
    border: 3px solid var(--accent-color-2);
}

.error-message {
    margin: 20px;
    text-align: center;
    color: var(--accent-color-2);
}

.reviews-container {
    margin: 20px;
    padding: 20px;
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);
}

.reviews-container h2 {
    color: var(--accent-color-2);
    text-align: center;
    margin-bottom: 20px;
}

.loading,
.error {
    text-align: center;
    color: var(--accent-color-2);
    padding: 1rem;
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
        grid-template-areas:
            "main restaurant"
            "reviews reviews";
    }

    .burgerMain {
        grid-area: main;
    }

    .restaurantInfo {
        grid-area: restaurant;
    }

    .reviews-container {
        grid-area: reviews;
        grid-column: 1 / -1;
    }
}
</style>
