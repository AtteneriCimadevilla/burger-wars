<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useBurger } from '@/composables';
import StarRating from '@/components/StarRating.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ReviewForm from '@/components/ReviewForm.vue';
import ReviewsComponent from '@/components/ReviewsComponent.vue';
import useAuth from '@/composables/useAuth';

const route = useRoute();
const id = route.params.id;

const { burger, restaurant, error, loading, loadBurger } = useBurger(id);
const { isAuthenticated, user } = useAuth();

const reviews = ref([]);
const reviewsLoading = ref(true);
const reviewsError = ref('');

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
};

const handleReviewUpdated = (updatedReview) => {
    const index = reviews.value.findIndex(r => r.id === updatedReview.id);
    if (index !== -1) {
        reviews.value[index] = {
            ...reviews.value[index],
            ...updatedReview
        };
    }
};

// Check if current user has already reviewed this burger
const userReview = computed(() => {
    if (!isAuthenticated.value || !user.value) return null;
    return reviews.value.find(review => review.user_id === user.value.id);
});

// Reviews from other users (excluding current user's review)
const otherReviews = computed(() => {
    if (!isAuthenticated.value || !user.value) return reviews.value;
    return reviews.value.filter(review => review.user_id !== user.value.id);
});

const canWriteReview = computed(() => {
    return isAuthenticated.value && !userReview.value;
});

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
                <StarRating :rating="burger.rating" />
            </div>
            <div class="burgerDetails">
                <p v-if="burger.amount">{{ burger.amount }}g. {{ burger.main_ingredient }}</p>
                <p v-else>{{ burger.main_ingredient }}</p>
                <p>{{ burger.bread }}</p>
                <p>with {{ burger.ingredients }}</p>
                <p v-if="burger.allergens">allergens: {{ burger.allergens }}</p>
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

        <!-- Reviews Section -->
        <div class="reviews-container">
            <h2>Reviews</h2>

            <!-- User's own review (if exists) -->
            <div v-if="userReview" class="user-review-section">
                <ReviewsComponent :reviews="[userReview]" :showBurgerInfo="false" :showRestaurantInfo="false"
                    :showAuthor="true" :canEdit="true" @reviewUpdated="handleReviewUpdated" />
            </div>

            <!-- Review form (only if user can write a review) -->
            <ReviewForm v-if="canWriteReview" :burgerId="id" @submitted="handleReviewSubmitted" />

            <!-- Other users' reviews -->
            <div v-if="otherReviews.length > 0" class="other-reviews-section">
                <div v-if="reviewsLoading" class="loading">Loading reviews...</div>
                <div v-else-if="reviewsError" class="error">{{ reviewsError }}</div>
                <ReviewsComponent v-else :reviews="otherReviews" :showBurgerInfo="false" :canEdit="false"
                    @reviewUpdated="handleReviewUpdated" />
            </div>

            <!-- No reviews message -->
            <div v-if="!reviewsLoading && !reviewsError && reviews.length === 0" class="no-reviews">
                <p>No reviews yet. Be the first to review this burger!</p>
            </div>
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

.user-review-section,
.other-reviews-section {
    margin-bottom: 2rem;
}

.user-review-section h3,
.other-reviews-section h3 {
    color: var(--accent-color-2);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--accent-color-2);
}

.loading,
.error {
    text-align: center;
    color: var(--accent-color-2);
    padding: 1rem;
}

.no-reviews {
    text-align: center;
    color: var(--accent-color-2);
    padding: 2rem;
    background: var(--background-color);
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    margin-top: 1rem;
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
