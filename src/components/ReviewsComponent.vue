<script setup>
import { ref, computed } from 'vue';
import StarRating from '@/components/StarRating.vue';
import useAuth from '@/composables/useAuth';

const useAuthHook = useAuth();
const { isAuthenticated, user } = useAuthHook;

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
    showAuthor: {
        type: Boolean,
        default: true
    },
    showAverageRating: {
        type: Boolean,
        default: true
    },
    compactRatings: {
        type: Boolean,
        default: false
    },
    profileLayout: {
        type: Boolean,
        default: false
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

// Get restaurant image from a mapping or use a placeholder
const getRestaurantImage = (restaurantId) => {
    return `/img/rest${restaurantId}.png` || '/img/placeholder.jpg?height=60&width=60';
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
                <!-- Unified Header Row -->
                <div class="review-header" :class="{ 'profile-layout': props.profileLayout }">
                    <!-- Profile Layout: Burger Info -->
                    <RouterLink v-if="props.profileLayout && props.showBurgerInfo && review.burger_id"
                        :to="`/burger/${review.burger_id}`" class="info-block burger-block">
                        <div class="info-content">
                            <img v-if="review.burger_image" :src="review.burger_image" :alt="review.burger_name"
                                class="info-image" />
                            <span class="info-name">{{ review.burger_name }}</span>
                        </div>
                    </RouterLink>

                    <!-- Burger Layout: Author Info -->
                    <div v-if="!props.profileLayout && props.showAuthor && review.username"
                        class="info-block author-block">
                        <div class="info-content">
                            <img src="/img/placeholder.jpg?height=50&width=50" :alt="review.username"
                                class="info-image" />
                            <span class="info-name">{{ review.username }}</span>
                        </div>
                    </div>

                    <!-- Unified Ratings Block -->
                    <div class="ratings-block">
                        <div v-if="editingReview?.id === review.id" class="rating-inputs">
                            <p class="edit-instruction">Click stars to rate</p>
                            <div class="rating-column">
                                <div class="rating-item">
                                    <label class="rating-label">Taste:</label>
                                    <StarRating v-model:rating="editingReview.taste_rating" :maxRating="5"
                                        :interactive="true" />
                                </div>
                                <div class="rating-item">
                                    <label class="rating-label">Presentation:</label>
                                    <StarRating v-model:rating="editingReview.presentation_rating" :maxRating="5"
                                        :interactive="true" />
                                </div>
                                <div class="rating-item">
                                    <label class="rating-label">Quality/Price:</label>
                                    <StarRating v-model:rating="editingReview.quality_price_rating" :maxRating="5"
                                        :interactive="true" />
                                </div>
                            </div>
                        </div>
                        <div v-else class="rating-display">
                            <div class="rating-column">
                                <div class="rating-item">
                                    <span class="rating-label">Taste:</span>
                                    <StarRating :rating="review.taste_rating" :maxRating="5" />
                                </div>
                                <div class="rating-item">
                                    <span class="rating-label">Presentation:</span>
                                    <StarRating :rating="review.presentation_rating" :maxRating="5" />
                                </div>
                                <div class="rating-item">
                                    <span class="rating-label">Quality/Price:</span>
                                    <StarRating :rating="review.quality_price_rating" :maxRating="5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Restaurant Info (only in profile layout) -->
                    <RouterLink v-if="props.profileLayout && props.showRestaurantInfo && review.restaurant_id"
                        :to="`/restaurant/${review.restaurant_id}`" class="info-block restaurant-block">
                        <div class="info-content">
                            <img :src="getRestaurantImage(review.restaurant_id)" :alt="review.restaurant_name"
                                class="info-image" />
                        </div>
                    </RouterLink>
                </div>

                <!-- Comment Row (only show if there's a comment or if editing) -->
                <div v-if="editingReview?.id === review.id || (review.comment && review.comment.trim())"
                    class="review-content">
                    <textarea v-if="editingReview?.id === review.id" v-model="editingReview.comment"
                        placeholder="Your review..." rows="4"></textarea>
                    <p v-else>{{ review.comment }}</p>
                </div>

                <!-- Action Buttons -->
                <div class="review-actions" v-if="props.canEdit && isOwnReview(review)">
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

/* Unified Header Layout */
.review-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

/* Profile layout has 3 columns */
.review-header.profile-layout {
    grid-template-columns: auto 1fr auto;
}

/* Info Blocks (Burger, Author, Restaurant) */
.info-block {
    background: var(--accent-color-2);
    color: var(--accent-color-1);
    padding: 0.75rem;
    border-radius: 5px;
    border: 3px solid var(--accent-color-2);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    display: block;
    height: 100%;
}

.info-block:hover {
    background: var(--background-color);
    color: var(--accent-color-2);
}

.info-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: fit-content;
}

.info-image {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    object-fit: cover;
}

.info-name {
    font-size: 0.9rem;
    font-weight: 600;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Author Block Specific Styling */
.author-block .info-content {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.author-block .info-image {
    border-radius: 50%;
}

/* Burger Block Specific Styling */
.burger-block .info-content {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

/* Restaurant Block Specific Styling */
.restaurant-block .info-content {
    justify-content: center;
}

.restaurant-block .info-image {
    width: 60px;
    height: 60px;
}

/* Unified Ratings Block */
.ratings-block {
    display: flex;
    justify-content: center;
    /* Changed from flex-end to center */
    background: var(--background-color);
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    padding: 0.5rem;
}

/* This selector is no longer needed since all ratings are centered now, but keeping for reference */
.review-header.profile-layout .ratings-block {
    justify-content: center;
}

.rating-column {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: center;
}

.rating-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-bottom: 0.25rem;
}

.rating-label {
    font-variant: small-caps;
    font-weight: 600;
    color: var(--accent-color-2);
    font-size: 0.8rem;
    margin-right: 0.25rem;
    min-width: 80px;
    text-align: left;
}

.rating-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: center;
}

.edit-instruction {
    text-align: center;
    color: var(--accent-color-2);
    font-size: 0.6rem;
    font-style: italic;
    margin-bottom: 0.25rem;
}

/* Comment Section */
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

/* Action Buttons */
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

/* Error and Empty States */
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

/* Responsive Design */
@media (max-width: 768px) {

    .review-header,
    .review-header.profile-layout {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .info-content {
        justify-content: center;
        max-width: 100%;
    }

    .info-block {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
    }

    .restaurant-block .info-image {
        width: 50px;
        height: 50px;
    }

    .rating-label {
        min-width: 60px;
        font-size: 0.7rem;
    }

    .ratings-block {
        justify-content: center !important;
        width: 100%;
        box-sizing: border-box;
    }

    .review-card {
        padding: 1rem;
    }

    .review-content {
        padding: 0.75rem;
    }

    .review-actions {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .info-name {
        max-width: 100%;
        font-size: 0.8rem;
        text-align: center;
    }

    .rating-item {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .rating-label {
        text-align: center;
        margin-right: 0;
        margin-bottom: 0.25rem;
    }

    .edit-btn,
    .save-btn,
    .cancel-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.9rem;
    }

    .review-card {
        padding: 0.75rem;
    }
}

@media (max-width: 380px) {
    .review-card {
        padding: 0.5rem;
    }

    .ratings-block {
        padding: 0.25rem;
    }

    .info-block {
        padding: 0.5rem;
    }

    .info-image {
        width: 40px;
        height: 40px;
    }

    .restaurant-block .info-image {
        width: 40px;
        height: 40px;
    }
}
</style>
