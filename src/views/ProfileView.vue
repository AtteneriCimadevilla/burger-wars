<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '@/composables/useAuth';
import ReviewsComponent from '@/components/ReviewsComponent.vue';

const router = useRouter();
const { user, isAuthenticated, fetchUser, init } = useAuth();

const reviews = ref([]);
const loading = ref(true);
const error = ref('');
const authInitialized = ref(false);

// Profile form data
const profileForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});

const profileError = ref('');
const profileSuccess = ref('');
const profileLoading = ref(false);

// Initialize authentication first
const initializeAuth = async () => {
    try {
        await init();
        authInitialized.value = true;

        // Only redirect if auth is initialized and user is not authenticated
        if (!isAuthenticated.value) {
            router.push({ name: 'home' });
            return;
        }

        await initializeProfile();
    } catch (error) {
        console.error('Auth initialization error:', error);
        authInitialized.value = true;
        router.push({ name: 'home' });
    }
};

const initializeProfile = async () => {
    // Initialize profile form with user data
    if (user.value) {
        profileForm.value.username = user.value.username;
        profileForm.value.email = user.value.email;
    }

    await loadUserReviews();
};

// Watch for changes in authentication state
watch(isAuthenticated, (newValue) => {
    if (authInitialized.value && !newValue) {
        router.push({ name: 'home' });
    }
});

onMounted(initializeAuth);

const loadUserReviews = async () => {
    if (!user.value) return;

    try {
        const response = await fetch(`/api/reviews?user_id=${user.value.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to load reviews');
        }

        const data = await response.json();
        reviews.value = data;
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

const updateProfile = async () => {
    profileError.value = '';
    profileSuccess.value = '';

    if (profileForm.value.password && profileForm.value.password !== profileForm.value.confirmPassword) {
        profileError.value = 'Passwords do not match';
        return;
    }

    profileLoading.value = true;

    try {
        const updateData = {
            username: profileForm.value.username,
            email: profileForm.value.email,
        };

        if (profileForm.value.password) {
            updateData.password = profileForm.value.password;
        }

        const response = await fetch('/api/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify(updateData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update profile');
        }

        profileSuccess.value = 'Profile updated successfully!';
        profileForm.value.password = '';
        profileForm.value.confirmPassword = '';

        // Refresh user data
        await fetchUser();
    } catch (err) {
        profileError.value = err.message;
    } finally {
        profileLoading.value = false;
    }
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

const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0;
    const total = reviews.value.reduce((sum, review) => {
        return sum + (review.taste_rating + review.presentation_rating + review.quality_price_rating) / 3;
    }, 0);
    return Math.round((total / reviews.value.length) * 100) / 100;
});
</script>

<template>
    <div v-if="!authInitialized" class="loading-container">
        <div class="loading">Loading...</div>
    </div>

    <div v-else-if="!isAuthenticated" class="loading-container">
        <div class="loading">Redirecting...</div>
    </div>

    <div v-else class="profile-container">
        <div class="profile-sidebar">
            <!-- Profile Picture and Action Buttons -->
            <div class="profile-picture-section">
                <!-- Profile Picture -->
                <div class="profile-picture">
                    <img src="/img/placeholder.jpg?height=150&width=150" alt="Profile Picture" />
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                    <button class="loved-btn">
                        <span class="heart">♥</span>
                    </button>
                    <button class="hated-btn">
                        <span class="heart">💔</span>
                    </button>
                </div>
            </div>

            <!-- Badges Section -->
            <div class="badges-section">
                <h3>BADGES</h3>
                <div class="badge">
                    <span>Reviews: {{ reviews.length }}</span>
                </div>
                <div class="badge">
                    <span>Avg Rating: {{ averageRating }}/5</span>
                </div>
            </div>

            <!-- Profile Form -->
            <div class="profile-form">
                <form @submit.prevent="updateProfile">
                    <div class="form-field">
                        <label>USERNAME:</label>
                        <input type="text" v-model="profileForm.username" required />
                    </div>

                    <div class="form-field">
                        <label>EMAIL:</label>
                        <input type="email" v-model="profileForm.email" required />
                    </div>

                    <div class="form-field">
                        <label>PASSWORD:</label>
                        <input type="password" v-model="profileForm.password"
                            placeholder="Leave blank to keep current" />
                    </div>

                    <div class="form-field">
                        <label>REPEAT PASSWORD:</label>
                        <input type="password" v-model="profileForm.confirmPassword"
                            placeholder="Confirm new password" />
                    </div>

                    <button type="submit" :disabled="profileLoading" class="update-btn">
                        {{ profileLoading ? 'UPDATING...' : 'UPDATE PROFILE' }}
                    </button>

                    <div v-if="profileError" class="error-message">{{ profileError }}</div>
                    <div v-if="profileSuccess" class="success-message">{{ profileSuccess }}</div>
                </form>
            </div>
        </div>

        <div class="reviews-section">
            <h2>Your Reviews</h2>

            <div v-if="loading" class="loading">Loading reviews...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <ReviewsComponent v-else :reviews="reviews" :canEdit="true" :showBurgerInfo="true"
                :showRestaurantInfo="true" :showAuthor="false" :showAverageRating="false" :compactRatings="true"
                :profileLayout="true" @reviewUpdated="handleReviewUpdated" />
        </div>
    </div>
</template>

<style scoped>
.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
}

.loading {
    text-align: center;
    color: var(--accent-color-2);
    font-size: 1.2rem;
}

.profile-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    padding: 2rem;
    min-height: 60vh;
}

.profile-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.profile-picture {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.profile-picture img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 3px solid var(--accent-color-2);
    object-fit: cover;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.loved-btn,
.hated-btn {
    width: 60px;
    height: 60px;
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    background: var(--background-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    transition: background-color 0.3s ease;
}

.loved-btn:hover,
.hated-btn:hover {
    background-color: var(--accent-color-1);
}

.badges-section {
    background: var(--accent-color-1);
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
}

.badges-section h3 {
    color: var(--accent-color-2);
    margin-bottom: 1rem;
}

.badge {
    background: var(--background-color);
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    padding: 0.5rem;
    margin: 0.5rem 0;
    color: var(--accent-color-2);
}

.profile-form {
    background: var(--accent-color-1);
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    padding: 1.5rem;
}

.form-field {
    margin-bottom: 1rem;
}

.form-field label {
    display: block;
    color: var(--accent-color-2);
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.form-field input {
    width: 100%;
    padding: 0.5rem;
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    background: var(--background-color);
}

.update-btn {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--accent-color-2);
    color: var(--accent-color-1);
    border: none;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.update-btn:hover:not(:disabled) {
    background-color: var(--background-color);
    color: var(--accent-color-2);
}

.update-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.reviews-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.reviews-section h2 {
    color: var(--accent-color-2);
    text-align: center;
}

.error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.success-message {
    color: #28a745;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.error {
    text-align: center;
    color: var(--accent-color-2);
    padding: 2rem;
}
</style>
