<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '@/composables/useAuth';

const router = useRouter();
const { login, loading, error, isAuthenticated } = useAuth();

const form = ref({
    username: '',
    password: ''
});

const handleSubmit = async () => {
    const success = await login(form.value);
    if (success) {
        // Redirect to home page after successful login
        router.push({ name: 'home' });
    }
};

// If user is already authenticated, redirect to home
onMounted(() => {
    if (isAuthenticated.value) {
        router.push({ name: 'home' });
    }
});
</script>

<template>
    <div class="auth-container">
        <div class="auth-card">
            <h1>Login</h1>

            <form @submit.prevent="handleSubmit" class="auth-form">
                <div class="form-field">
                    <label for="username">Username or Email:</label>
                    <input type="text" id="username" v-model="form.username" placeholder="Enter your username or email"
                        required />
                </div>

                <div class="form-field">
                    <label for="password">Password:</label>
                    <input type="password" id="password" v-model="form.password" placeholder="Enter your password"
                        required />
                </div>

                <button type="submit" :disabled="loading" class="submit-btn">
                    {{ loading ? 'Logging in...' : 'Login' }}
                </button>

                <div v-if="error" class="error-message">
                    {{ error }}
                </div>
            </form>

            <div class="auth-links">
                <p>Don't have an account? <RouterLink to="/register">Register here</RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: 20px;
}

.auth-card {
    background: var(--background-color);
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);
}

.auth-card h1 {
    text-align: center;
    color: var(--accent-color-2);
    margin-bottom: 1.5rem;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-field label {
    font-weight: 600;
    color: var(--accent-color-2);
}

.form-field input {
    padding: 0.75rem;
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
    font-size: 1rem;
}

.form-field input:focus {
    outline: none;
    border-color: var(--accent-color-1);
    box-shadow: 0 0 5px rgba(219, 181, 66, 0.3);
}

.submit-btn {
    padding: 0.75rem;
    background-color: var(--accent-color-2);
    color: var(--accent-color-1);
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
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

.error-message {
    color: #dc3545;
    text-align: center;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.auth-links {
    text-align: center;
    margin-top: 1.5rem;
}

.auth-links a {
    color: var(--accent-color-2);
    font-weight: 600;
}

.auth-links a:hover {
    color: var(--accent-color-1);
}
</style>
