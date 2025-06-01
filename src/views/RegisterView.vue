<script setup>
import { ref } from 'vue';
import useAuth from '@/composables/useAuth';

const { register, loading, error } = useAuth();

const form = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});

const validationError = ref('');

const handleSubmit = async () => {
    validationError.value = '';

    if (form.value.password !== form.value.confirmPassword) {
        validationError.value = 'Passwords do not match';
        return;
    }

    if (form.value.password.length < 6) {
        validationError.value = 'Password must be at least 6 characters';
        return;
    }

    const { confirmPassword, ...userData } = form.value;
    await register(userData);
};
</script>

<template>
    <div class="auth-container">
        <div class="auth-card">
            <h1>Register</h1>

            <form @submit.prevent="handleSubmit" class="auth-form">
                <div class="form-field">
                    <label for="username">Username:</label>
                    <input type="text" id="username" v-model="form.username" placeholder="Choose a username" required />
                </div>

                <div class="form-field">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="form.email" placeholder="Enter your email" required />
                </div>

                <div class="form-field">
                    <label for="password">Password:</label>
                    <input type="password" id="password" v-model="form.password"
                        placeholder="Choose a password (min 6 characters)" required />
                </div>

                <div class="form-field">
                    <label for="confirmPassword">Confirm Password:</label>
                    <input type="password" id="confirmPassword" v-model="form.confirmPassword"
                        placeholder="Confirm your password" required />
                </div>

                <button type="submit" :disabled="loading" class="submit-btn">
                    {{ loading ? 'Creating account...' : 'Register' }}
                </button>

                <div v-if="error || validationError" class="error-message">
                    {{ error || validationError }}
                </div>
            </form>

            <div class="auth-links">
                <p>Already have an account? <RouterLink to="/login">Login here</RouterLink>
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
