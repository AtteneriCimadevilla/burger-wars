<script setup>
import MenuComponent from '../components/MenuComponent.vue';
import useAuth from "@/composables/useAuth.js";

const { isAuthenticated, logout } = useAuth();
</script>

<template>
    <header>
        <RouterLink to="/">
            <img class="logo" src="/img/logo.png" alt="Home" />
        </RouterLink>

        <MenuComponent />
    </header>
</template>

<style scoped>
header {
    height: 20vh;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    justify-items: right;
    background-color: var(--accent-color-2);
    padding: 10px 20px;
}

.logo {
    height: 15vh;
    margin-left: 20px;
}

@media only screen and (max-width: 768px) {
    header {
        padding: 0 15px;
    }
}

@media only screen and (max-width: 480px) {
    header {
        padding: 0 10px;
    }

    .logo {
        height: 12vh;
        margin-left: 10px;
    }
}

@media only screen and (max-width: 380px) {
    .logo {
        height: 10vh;
        margin-left: 5px;
    }
}
</style>
