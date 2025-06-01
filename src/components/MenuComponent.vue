<script setup>
import { ref } from 'vue';
import useAuth from '@/composables/useAuth';
import LoginModal from './LoginModal.vue';

const showLoginModal = ref(false);

const { isAuthenticated, user, logout } = useAuth();

const handleLogout = () => {
    logout();
    // Refresh the page to update the UI
    window.location.reload();
};

const openLoginModal = () => {
    showLoginModal.value = true;
};

const closeLoginModal = () => {
    showLoginModal.value = false;
};

const handleLoginSuccess = () => {
    // This will be called when login is successful
    // The modal will handle closing itself and refreshing the page
};
</script>

<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/restaurants">Restaurants</RouterLink>
        <RouterLink to="/burgers">Burgers</RouterLink>
        <RouterLink to="/about">About us</RouterLink>
        <template v-if="isAuthenticated">
            <RouterLink to="/profile">Profile</RouterLink>
            <button @click="handleLogout" class="logout-btn">Log out</button>
        </template>
        <template v-else>
            <RouterLink to="/register">Register</RouterLink>
            <button @click="openLoginModal" class="login-btn">Log in</button>
        </template>
    </nav>

    <!-- Login Modal -->
    <LoginModal :isOpen="showLoginModal" @close="closeLoginModal" @loginSuccess="handleLoginSuccess" />
</template>

<style scoped>
nav {
    margin: 0 20px;
    display: flex;
    column-gap: 20px;
    align-items: center;
}

a {
    text-decoration: none;
    justify-self: center;
    color: var(--accent-color-1);
}

a:hover {
    color: var(--background-color);
}

.user-greeting {
    color: var(--accent-color-1);
    font-size: 0.9rem;
}

.logout-btn,
.login-btn {
    background: none;
    border: 2px solid var(--accent-color-1);
    color: var(--accent-color-1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.logout-btn:hover,
.login-btn:hover {
    background-color: var(--accent-color-1);
    color: var(--accent-color-2);
}

@media only screen and (max-width: 600px) {
    nav {
        flex-direction: column;
        row-gap: 10px;
    }

    nav a,
    .user-greeting,
    .logout-btn,
    .login-btn {
        font-size: 0.8rem;
        line-height: 0.8;
    }
}
</style>
