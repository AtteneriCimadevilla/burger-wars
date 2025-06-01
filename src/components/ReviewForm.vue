<script setup>
import { ref } from 'vue';
import useAuth from '@/composables/useAuth';

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

const taste = ref(5);
const presentation = ref(5);
const qualityPrice = ref(5);
const comment = ref('');

const error = ref('');
const success = ref(false);
const loading = ref(false);

const submitReview = async () => {
    if (!isAuthenticated.value) {
        error.value = 'You must be logged in to submit a review';
        return;
    }

    loading.value = true;
    error.value = '';
    success.value = false;

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            },
            body: JSON.stringify({
                burger_id: props.burgerId,
                taste_rating: taste.value,
                presentation_rating: presentation.value,
                quality_price_rating: qualityPrice.value,
                comment: comment.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error submitting review');
        }

        success.value = true;
        error.value = '';
        taste.value = presentation.value = qualityPrice.value = 5;
        comment.value = '';

        emit('submitted');
        props.onSubmitted?.();
    } catch (err) {
        error.value = err.message;
        success.value = false;
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

            <div class="field">
                <label for="taste">Taste: {{ taste }}/10</label>
                <input type="range" min="1" max="10" v-model.number="taste" />
            </div>

            <div class="field">
                <label for="presentation">Presentation: {{ presentation }}/10</label>
                <input type="range" min="1" max="10" v-model.number="presentation" />
            </div>

            <div class="field">
                <label for="quality">Quality/Price: {{ qualityPrice }}/10</label>
                <input type="range" min="1" max="10" v-model.number="qualityPrice" />
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
    margin-bottom: 1rem;
    font-size: 0.9rem;
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

.field input[type="range"] {
    width: 100%;
    margin-bottom: 0.5rem;
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
</style>
