<script setup>
import { ref, computed } from 'vue';
import StarRating from '@/components/StarRating.vue';
import useAuth from '@/composables/useAuth';

const { isAuthenticated, user } = useAuth();

const props = defineProps({
    reviews: {
        type: Array,
        required: true
    },
    showBurgerInfo: {
        type: Boolean,
        default: true
    },
    showRestaurantInfo: {
        type: Boolean,
        default: true
    },
    canEdit: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['reviewUpdated']);

const editingReview = ref(null);
const error = ref('');

const startEditingReview = (review) => {
    editingReview.value = {
        id: review.id,
        taste_rating: review.taste_rating,
        presentation_rating: review.presentation_rating,
        quality_price_rating: review.quality_price_rating,
        comment: review.comment || '',
    };
};

const cancelEditingReview = () => {
    editingReview.value = null;
};

const saveReview = async (reviewId) => {
    try {
        const apiData = {
            reviewId,
            taste_rating: editingReview.value.taste_rating,
            presentation_rating: editingReview.value.presentation_rating,
            quality_price_rating: editingReview.value.quality_price_rating,
            comment: editingReview.value.comment,
        };

        console.log('Updating review (0-5 scale):', apiData);

        const response = await fetch('/api/update-review', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify(apiData),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to update review');
        }

        // Emit event to parent component to update the review
        emit('reviewUpdated', {
            id: reviewId,
            ...apiData
        });

        editingReview.value = null;
    } catch (err) {
        error.value = err.message;
        console.error('Review update error:', err);
    }
};

const calculateAverageRating = (review) => {
    const avg = (review.taste_rating + review.presentation_rating + review.quality_price_rating) / 3;
    return Math.round(avg * 10) / 10;
};

const isOwnReview = (review) => {
    return isAuthenticated.value && user.value && review.user_id === user.value.id;
};
</script>

<template>
    <div class="reviews-list">
        <div v-if="error" class="error-message">{{ error }}</div>

        <div v-if="reviews.length === 0" class="no-reviews">
            No reviews yet.
        </div>

        <div v-else class="reviews-container">
            <div v-for="review in reviews" :key="review.id" class="review-card">
                <div class="review-header">
                    <!-- Burger Info (optional) -->
                    <RouterLink v-if="showBurgerInfo && review.burger_id" :to="`/burger/${review.burger_id}`"
                        class="burger-link">
                        <div class="burger-info">
                            <img v-if="review.burger_image" :src="review.burger_image" :alt="review.burger_name"
                                class="burger-image" />
                            <strong>{{ review.burger_name }}</strong>
                        </div>
                    </RouterLink>

                    <!-- User Info (if available) -->
                    <div v-if="review.username" class="user-info">
                        <span>By: {{ review.username }}</span>
                    </div>

                    <!-- Restaurant Info (optional) -->
                    <RouterLink v-if="showRestaurantInfo && review.restaurant_id"
                        :to="`/restaurant/${review.restaurant_id}`" class="restaurant-link">
                        {{ review.restaurant_name }}
                    </RouterLink>
                </div>

                <!-- Ratings Section -->
                <div class="ratings-section">
                    <div v-if="editingReview?.id === review.id" class="rating-inputs">
                        <p class="edit-instruction">Click stars to rate (click same star again or outside to set to 0)
                        </p>
                        <div class="rating-item">
                            <label>Taste:</label>
                            <StarRating v-model:rating="editingReview.taste_rating" :maxRating="5"
                                :interactive="true" />
                        </div>
                        <div class="rating-item">
                            <label>Presentation:</label>
                            <StarRating v-model:rating="editingReview.presentation_rating" :maxRating="5"
                                :interactive="true" />
                        </div>
                        <div class="rating-item">
                            <label>Quality/Price:</label>
                            <StarRating v-model:rating="editingReview.quality_price_rating" :maxRating="5"
                                :interactive="true" />
                        </div>
                    </div>
                    <div v-else class="rating-display">
                        <div class="rating-row">
                            <div class="rating-item">
                                <span>Taste:</span>
                                <StarRating :rating="review.taste_rating" :maxRating="5" />
                            </div>
                            <div class="rating-item">
                                <span>Presentation:</span>
                                <StarRating :rating="review.presentation_rating" :maxRating="5" />
                            </div>
                            <div class="rating-item">
                                <span>Quality/Price:</span>
                                <StarRating :rating="review.quality_price_rating" :maxRating="5" />
                            </div>
                        </div>
                        <div class="average-rating">
                            <span>Average: {{ calculateAverageRating(review) }}/5</span>
                            <StarRating :rating="calculateAverageRating(review)" :maxRating="5" />
                        </div>
                    </div>
                </div>

                <div class="review-content">
                    <textarea v-if="editingReview?.id === review.id" v-model="editingReview.comment"
                        placeholder="Your review..." rows="4"></textarea>
                    <p v-else>{{ review.comment || 'No comment provided.' }}</p>
                </div>

                <div class="review-actions" v-if="canEdit && isOwnReview(review)">
                    <button v-if="editingReview?.id === review.id" @click="saveReview(review.id)" class="save-btn">
                        Save
                    </button>
                    <button v-if="editingReview?.id === review.id" @click="cancelEditingReview" class="cancel-btn">
                        Cancel
                    </button>
                    <button v-else @click="startEditingReview(review)" class="edit-btn">
                        Edit
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.reviews-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.reviews-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.review-card {
    background: var(--accent-color-1);
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    padding: 1.5rem;
}

.review-header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: center;
}

.burger-link,
.restaurant-link {
    background: var(--accent-color-2);
    color: var(--accent-color-1);
    padding: 0.5rem;
    border-radius: 5px;
    text-decoration: none;
    text-align: center;
    font-weight: 600;
    transition: all 0.3s ease;
    display: block;
}

.burger-link:hover,
.restaurant-link:hover {
    background: var(--background-color);
    color: var(--accent-color-2);
}

.burger-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.burger-image {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    object-fit: cover;
}

.user-info {
    text-align: center;
    font-weight: 600;
    color: var(--accent-color-2);
}

.ratings-section {
    background: var(--background-color);
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.rating-display {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.rating-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: space-around;
}

.rating-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.rating-item span,
.rating-item label {
    font-weight: 600;
    color: var(--accent-color-2);
    font-size: 0.9rem;
}

.average-rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--accent-color-2);
    font-weight: 600;
    color: var(--accent-color-2);
}

.rating-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: space-around;
}

.edit-instruction {
    width: 100%;
    text-align: center;
    color: var(--accent-color-2);
    font-size: 0.8rem;
    font-style: italic;
    margin-bottom: 1rem;
}

.review-content {
    background: var(--background-color);
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    padding: 1rem;
    margin-bottom: 1rem;
    min-height: 80px;
}

.review-content textarea {
    width: 100%;
    border: none;
    background: transparent;
    resize: vertical;
    font-family: inherit;
    color: var(--text-color);
}

.review-content textarea:focus {
    outline: none;
}

.review-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.edit-btn,
.save-btn,
.cancel-btn {
    padding: 0.5rem 1rem;
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.edit-btn {
    background: var(--accent-color-2);
    color: var(--accent-color-1);
}

.save-btn {
    background: #28a745;
    color: white;
    border-color: #28a745;
}

.cancel-btn {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
}

.edit-btn:hover,
.save-btn:hover,
.cancel-btn:hover {
    opacity: 0.8;
}

.error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    text-align: center;
}

.no-reviews {
    text-align: center;
    color: var(--accent-color-2);
    padding: 2rem;
    background: var(--background-color);
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
}

@media (max-width: 768px) {
    .rating-row {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .rating-inputs {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
}
</style>
