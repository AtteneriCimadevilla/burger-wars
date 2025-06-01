<script setup>
import { ref } from 'vue';
import useAuth from '@/composables/useAuth';

const { login, loading, error } = useAuth();

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'loginSuccess']);

const form = ref({
    username: '',
    password: ''
});

const localError = ref('');

const handleSubmit = async () => {
    localError.value = '';

    try {
        const success = await login(form.value);
        if (success) {
            // Reset form
            form.value = { username: '', password: '' };
            // Emit success event to parent
            emit('loginSuccess');
            // Close modal
            emit('close');
            // Refresh the page to update the UI
            window.location.reload();
        } else {
            localError.value = error.value || 'Login failed';
        }
    } catch (err) {
        localError.value = 'An unexpected error occurred';
        console.error('Login error:', err);
    }
};

const closeModal = () => {
    // Reset form and errors when closing
    form.value = { username: '', password: '' };
    localError.value = '';
    emit('close');
};

const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
};
</script>

<template>
    <div v-if="isOpen" class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Login</h2>
                <button class="close-btn" @click="closeModal">&times;</button>
            </div>

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

                <div v-if="localError || error" class="error-message">
                    {{ localError || error }}
                </div>
            </form>

            <div class="auth-links">
                <p>Don't have an account? <RouterLink to="/register" @click="closeModal">Register here</RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: var(--background-color);
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.modal-header h2 {
    color: var(--accent-color-2);
    margin: 0;
    font-size: 1.5rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--accent-color-2);
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;
}

.close-btn:hover {
    background-color: var(--accent-color-1);
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
