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
    padding: 10px;
}
.logo {
    height: 15vh;
}

@media only screen and (max-width: 550px) {
    header {
        padding: 0 30px;
    }
}
</style>