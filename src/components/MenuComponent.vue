<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/restaurants">Restaurants</RouterLink>
        <RouterLink to="/burgers">Burgers</RouterLink>
        <RouterLink to="/about">About us</RouterLink>
    </nav>
</template>

<script>
export default {
    name: 'MenuComponent'
}
</script>

<style scoped>
nav {
    margin: 0 20px;
    display: flex;
    column-gap: 20px;
}

a {
    text-decoration: none;
    justify-self: center;
}

@media only screen and (max-width: 550px) {
    nav {
        flex-direction: column;
        row-gap: 10px;
    }
    nav a {
        font-size: 0.8rem;
        line-height: 0.8;
    }
    
}
</style>