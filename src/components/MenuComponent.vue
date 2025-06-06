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
        <!-- Navigation Links Section -->
        <div class="nav-links">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/restaurants">Restaurants</RouterLink>
            <RouterLink to="/burgers">Burgers</RouterLink>
            <RouterLink to="/about">About us</RouterLink>
        </div>

        <!-- Authentication Section -->
        <div class="auth-section">
            <template v-if="isAuthenticated">
                <RouterLink to="/profile">Profile</RouterLink>
                <button @click="handleLogout" class="logout-btn">Log out</button>
            </template>
            <template v-else>
                <RouterLink to="/register">Register</RouterLink>
                <button @click="openLoginModal" class="login-btn">Log in</button>
            </template>
        </div>
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
    justify-content: flex-end;
    width: 100%;
}

.nav-links {
    display: flex;
    column-gap: 20px;
    align-items: center;
}

.auth-section {
    display: flex;
    column-gap: 20px;
    align-items: center;
}

a {
    text-decoration: none;
    justify-self: center;
    color: var(--accent-color-1);
    white-space: nowrap;
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
    white-space: nowrap;
}

.logout-btn:hover,
.login-btn:hover {
    background-color: var(--accent-color-1);
    color: var(--accent-color-2);
}

/* Medium screens: Two-column layout with nav-links in single column */
@media only screen and (max-width: 920px) and (min-width: 601px) {
    nav {
        display: flex;
        gap: 15px;
        margin: 0 30px;
        justify-items: center;
        align-items: center;
    }

    .nav-links {
        justify-self: end;
        flex-direction: column;
        row-gap: 10px;
        align-items: center;
        width: 100%;
    }

    .auth-section {
        justify-self: end;
        flex-direction: column;
        row-gap: 15px;
        align-items: center;
    }

    nav a,
    .logout-btn,
    .login-btn {
        font-size: 0.85rem;
    }
}

/* Small screens: Single column layout */
@media only screen and (max-width: 600px) {
    nav {
        flex-direction: column;
        row-gap: 10px;
        margin: 0 5px;
    }

    .nav-links {
        flex-direction: column;
        row-gap: 8px;
        align-items: center;
    }

    .auth-section {
        flex-direction: column;
        row-gap: 8px;
        align-items: center;
    }

    nav a,
    .user-greeting,
    .logout-btn,
    .login-btn {
        font-size: 0.8rem;
        line-height: 1;
    }

    .logout-btn,
    .login-btn {
        padding: 0.2rem 0.4rem;
    }
}
</style>
