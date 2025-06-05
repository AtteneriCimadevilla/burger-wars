<script setup>
import { ref } from 'vue';
import useAuth from '@/composables/useAuth';
import StarRating from '@/components/StarRating.vue';

const { isAuthenticated, user } = useAuth();

const props = defineProps({
    burgerId: {
        type: String,
        required: true
    },
    onSubmitted: {
        type: Function,
        default: () => { }
    }
});

const emit = defineEmits(['submitted']);

const taste = ref(0);
const presentation = ref(0);
const qualityPrice = ref(0);
const comment = ref('');

const error = ref('');
const success = ref(false);
const loading = ref(false);

const submitReview = async () => {
    loading.value = true;
    error.value = '';
    success.value = false;

    if (!isAuthenticated.value) {
        error.value = 'You must be logged in to submit a review';
        loading.value = false;
        return;
    }

    try {
        console.log('Submitting ratings (0-5 scale):', {
            taste: taste.value,
            presentation: presentation.value,
            qualityPrice: qualityPrice.value
        });

        // Get the token from localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('Authentication token not found. Please log in again.');
        }

        console.log('Using auth token:', token);

        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                burger_id: props.burgerId,
                taste_rating: taste.value,
                presentation_rating: presentation.value,
                quality_price_rating: qualityPrice.value,
                comment: comment.value
            })
        });

        // Log the full response for debugging
        console.log('Review submission response status:', response.status);

        const data = await response.json();
        console.log('Review submission response data:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Error submitting review');
        }

        success.value = true;
        error.value = '';
        taste.value = presentation.value = qualityPrice.value = 0;
        comment.value = '';

        emit('submitted');
        props.onSubmitted?.();
    } catch (err) {
        error.value = err.message;
        success.value = false;
        console.error('Review submission error:', err);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="review-form">
        <div v-if="!isAuthenticated" class="auth-required">
            <p>You must be <RouterLink to="/login">logged in</RouterLink> to submit a review.</p>
        </div>

        <div v-else>
            <h3>Submit your review</h3>
            <p class="reviewer">Reviewing as: <strong>{{ user?.username }}</strong></p>
            <p class="instruction">Click stars to rate (click same star again or outside to set to 0)</p>

            <div class="ratings-container">
                <div class="rating-field">
                    <label>Taste:</label>
                    <StarRating v-model:rating="taste" :maxRating="5" :interactive="true" />
                </div>

                <div class="rating-field">
                    <label>Presentation:</label>
                    <StarRating v-model:rating="presentation" :maxRating="5" :interactive="true" />
                </div>

                <div class="rating-field">
                    <label>Quality/Price:</label>
                    <StarRating v-model:rating="qualityPrice" :maxRating="5" :interactive="true" />
                </div>
            </div>

            <div class="field">
                <label for="comment">Comment:</label>
                <textarea v-model="comment" placeholder="Optional comment about this burger..."></textarea>
            </div>

            <button @click="submitReview" :disabled="loading" class="submit-btn">
                {{ loading ? 'Submitting...' : 'Submit Review' }}
            </button>

            <p v-if="error" class="error">{{ error }}</p>
            <p v-if="success" class="success">Thanks for your review!</p>
        </div>
    </div>
</template>

<style scoped>
.review-form {
    margin: 1rem 0;
    padding: 1rem;
    border: 2px solid var(--accent-color-2);
    border-radius: 10px;
    background-color: var(--background-color);
}

.auth-required {
    text-align: center;
    color: var(--accent-color-2);
}

.auth-required a {
    color: var(--accent-color-1);
    font-weight: 600;
}

.reviewer {
    color: var(--accent-color-2);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.instruction {
    color: var(--accent-color-2);
    font-size: 0.8rem;
    font-style: italic;
    margin-bottom: 1rem;
}

.ratings-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1rem;
    justify-content: space-between;
}

.rating-field {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 120px;
}

.rating-field label {
    color: var(--accent-color-2);
    font-weight: 600;
}

.field {
    margin-bottom: 1rem;
}

.field label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--accent-color-2);
    font-weight: 600;
}

.field textarea {
    width: 100%;
    padding: 0.5rem;
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    resize: vertical;
    min-height: 80px;
}

.submit-btn {
    background-color: var(--accent-color-2);
    color: var(--accent-color-1);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
    background-color: var(--accent-color-1);
    color: var(--accent-color-2);
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error {
    color: #dc3545;
    margin-top: 0.5rem;
}

.success {
    color: #28a745;
    margin-top: 0.5rem;
}

@media (max-width: 768px) {
    .ratings-container {
        flex-direction: column;
        align-items: center;
    }
}
</style>
