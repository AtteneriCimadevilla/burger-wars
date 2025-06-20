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

const handleReviewDeleted = (reviewId) => {
    reviews.value = reviews.value.filter(r => r.id !== reviewId);
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
                        <span class="heart">❤️</span>
                    </button>
                    <button class="hated-btn">
                        <span class="heart">💔</span>
                    </button>
                </div>
            </div>

            <!-- Badge Section -->
            <div class="badge-section">
                <div class="review-badge">
                    <div class="badge-container">
                        <div class="badge-circle">
                            <!-- Simple burger icon -->
                            <svg viewBox="0 0 60 60" class="burger-icon">
                                <!-- Bottom bun -->
                                <ellipse cx="30" cy="50" rx="20" ry="5" fill="#D2691E" />
                                <!-- Lettuce -->
                                <ellipse cx="30" cy="45" rx="18" ry="3" fill="#228B22" />
                                <!-- Meat -->
                                <ellipse cx="30" cy="40" rx="16" ry="4" fill="#8B4513" />
                                <!-- Cheese -->
                                <ellipse cx="30" cy="35" rx="17" ry="2" fill="#FFD700" />
                                <!-- Top bun -->
                                <ellipse cx="30" cy="25" rx="18" ry="10" fill="#DEB887" />
                                <!-- Sesame seeds -->
                                <circle cx="22" cy="22" r="1" fill="#F5DEB3" />
                                <circle cx="30" cy="20" r="1" fill="#F5DEB3" />
                                <circle cx="38" cy="24" r="1" fill="#F5DEB3" />
                            </svg>
                        </div>
                        <!-- Review count badge -->
                        <div class="count-badge">
                            {{ reviews.length }}
                        </div>
                    </div>
                    <span class="badge-label">Reviews</span>
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
                :profileLayout="true" @reviewUpdated="handleReviewUpdated" @reviewDeleted="handleReviewDeleted" />
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

.badge-section {
    background: var(--accent-color-1);
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    padding: 1.5rem;
    text-align: center;
}

.review-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.badge-container {
    position: relative;
    display: inline-block;
}

.badge-circle {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--accent-color-2), #8b0814);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    border: 3px solid var(--background-color);
}

.burger-icon {
    width: 50px;
    height: 50px;
}

.count-badge {
    position: absolute;
    bottom: -5px;
    right: -5px;
    background: var(--accent-color-1);
    color: var(--accent-color-2);
    border: 2px solid var(--accent-color-2);
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.badge-label {
    color: var(--accent-color-2);
    font-weight: 600;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
    color: var(--logo-color);
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.success-message {
    color: var(--accent-color-2);
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.error {
    text-align: center;
    color: var(--accent-color-2);
    padding: 2rem;
}

@media (max-width: 768px) {
    .profile-container {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
    }

    .badge-circle {
        width: 70px;
        height: 70px;
    }

    .burger-icon {
        width: 40px;
        height: 40px;
    }

    .count-badge {
        width: 24px;
        height: 24px;
        font-size: 0.7rem;
    }
}
</style>
