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
    const restaurantImages = {
        '001': '/img/rest001.png',
        '002': '/img/rest002.png',
        '003': '/img/rest003.png',
        '004': '/img/rest004.png',
        '005': '/img/rest005.png',
        '006': '/img/rest006.png',
        '007': '/img/rest007.png',
        '008': '/img/rest008.png',
        '009': '/img/rest009.png',
        '010': '/img/rest010.png',
        '011': '/img/rest011.png',
        '012': '/img/rest012.png',
        '013': '/img/rest013.png',
    };
    return restaurantImages[restaurantId] || '/img/placeholder.jpg?height=60&width=60';
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
                <div class="review-header" :class="{ 'profile-header': props.profileLayout }">
                    <!-- Burger Info (optional) -->
                    <RouterLink v-if="props.showBurgerInfo && review.burger_id" :to="`/burger/${review.burger_id}`"
                        class="burger-link" :class="{ 'profile-burger': props.profileLayout }">
                        <div class="burger-info" :class="{ 'profile-burger-info': props.profileLayout }">
                            <img v-if="review.burger_image" :src="review.burger_image" :alt="review.burger_name"
                                class="burger-image" />
                            <span v-if="props.profileLayout" class="burger-name">{{ review.burger_name }}</span>
                            <strong v-else>{{ review.burger_name }}</strong>
                        </div>
                    </RouterLink>

                    <!-- Compact Ratings in Profile Layout -->
                    <div v-if="props.profileLayout" class="profile-ratings">
                        <div v-if="editingReview?.id === review.id" class="profile-rating-inputs">
                            <p class="edit-instruction">Click stars to rate</p>
                            <div class="profile-rating-column">
                                <div class="profile-rating-item">
                                    <label class="rating-label">Taste:</label>
                                    <StarRating v-model:rating="editingReview.taste_rating" :maxRating="5"
                                        :interactive="true" />
                                </div>
                                <div class="profile-rating-item">
                                    <label class="rating-label">Presentation:</label>
                                    <StarRating v-model:rating="editingReview.presentation_rating" :maxRating="5"
                                        :interactive="true" />
                                </div>
                                <div class="profile-rating-item">
                                    <label class="rating-label">Quality/Price:</label>
                                    <StarRating v-model:rating="editingReview.quality_price_rating" :maxRating="5"
                                        :interactive="true" />
                                </div>
                            </div>
                        </div>
                        <div v-else class="profile-rating-display">
                            <div class="profile-rating-column">
                                <div class="profile-rating-item">
                                    <span class="rating-label">Taste:</span>
                                    <StarRating :rating="review.taste_rating" :maxRating="5" />
                                </div>
                                <div class="profile-rating-item">
                                    <span class="rating-label">Presentation:</span>
                                    <StarRating :rating="review.presentation_rating" :maxRating="5" />
                                </div>
                                <div class="profile-rating-item">
                                    <span class="rating-label">Quality/Price:</span>
                                    <StarRating :rating="review.quality_price_rating" :maxRating="5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Restaurant Info (optional) -->
                    <RouterLink v-if="props.showRestaurantInfo && review.restaurant_id"
                        :to="`/restaurant/${review.restaurant_id}`" class="restaurant-link"
                        :class="{ 'profile-restaurant': props.profileLayout }">
                        <div class="restaurant-info" :class="{ 'profile-restaurant-info': props.profileLayout }">
                            <img :src="getRestaurantImage(review.restaurant_id)" :alt="review.restaurant_name"
                                class="restaurant-image" />
                        </div>
                    </RouterLink>

                    <!-- User Info (if enabled and available) -->
                    <div v-if="props.showAuthor && review.username" class="user-info">
                        <span>By: {{ review.username }}</span>
                    </div>
                </div>

                <div class="review-content">
                    <textarea v-if="editingReview?.id === review.id" v-model="editingReview.comment"
                        placeholder="Your review..." rows="4"></textarea>
                    <p v-else>{{ review.comment || 'No comment provided.' }}</p>
                </div>

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

.burger-info,
.restaurant-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.burger-image,
.restaurant-image {
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

/* Compact Ratings Styles */
.compact-ratings {
    background: var(--background-color);
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    padding: 0.75rem;
    margin-bottom: 1rem;
}

.compact-rating-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
}

.compact-rating-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.compact-rating-item span,
.compact-rating-item label {
    font-weight: 600;
    color: var(--accent-color-2);
    font-size: 0.8rem;
    min-width: 25px;
}

.compact-rating-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.compact-rating-inputs .edit-instruction {
    text-align: center;
    color: var(--accent-color-2);
    font-size: 0.7rem;
    font-style: italic;
}

/* Full Ratings Styles */
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

/* Profile Layout Styles */
.profile-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

.profile-burger {
    background: var(--accent-color-2);
    color: var(--accent-color-1);
    padding: 0.75rem;
    border-radius: 5px;
    border: 3px solid var(--accent-color-2);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    display: block;
    width: fit-content;
    height: 100%;
}

.profile-burger-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: fit-content;
}

.profile-burger-info .burger-image {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    object-fit: cover;
}

.burger-name {
    font-size: 0.9rem;
    font-weight: 600;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.profile-ratings {
    display: flex;
    justify-content: center;
    background: var(--background-color);
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    padding: 0.5rem;
}

.profile-rating-column {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: center;
}

.profile-rating-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-bottom: 0.25rem;
}

.profile-rating-item span,
.profile-rating-item label {
    font-weight: 600;
    color: var(--accent-color-2);
    font-size: 0.7rem;
    min-width: 20px;
}

.profile-rating-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: center;
}

.profile-rating-inputs .edit-instruction {
    text-align: center;
    color: var(--accent-color-2);
    font-size: 0.6rem;
    font-style: italic;
    margin-bottom: 0.25rem;
}

.profile-restaurant {
    background: var(--accent-color-2);
    color: var(--accent-color-1);
    padding: 0.5rem;
    border-radius: 5px;
    border: 3px solid var(--accent-color-2);
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.profile-restaurant:hover {
    background: var(--background-color);
    color: var(--accent-color-2);
}

.profile-restaurant-info {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.profile-restaurant-info .restaurant-image {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    object-fit: cover;
}

@media (max-width: 768px) {
    .profile-header {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .profile-burger-info {
        justify-content: center;
    }

    .profile-restaurant-info .restaurant-image {
        width: 60px;
        height: 60px;
    }
}

.rating-label {
    font-variant: small-caps;
    font-weight: 600;
    color: var(--accent-color-2);
    font-size: 0.8rem;
    margin-right: 0.25rem;
}
</style>
