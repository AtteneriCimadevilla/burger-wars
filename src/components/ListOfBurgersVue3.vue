<script setup>
import { ref, computed } from 'vue'
import SearchInputVue3 from './SearchInputVue3.vue'

const burgersList = JSON.parse(localStorage.getItem('burgers'))

const burgers = ref(burgersList)
const search = ref('')

const filteredBurgers = computed(() => {
    return burgers.value.filter(burger => {
        const matchesSearch = burger.name.toLowerCase().includes(search.value.toLowerCase()) ||
            burger.ingredients.toLowerCase().includes(search.value.toLowerCase())
        return matchesSearch
    })
})
</script>

<template>
    <div>
        <div class="mainHeader">
            <h2>List of Burgers Vue 3</h2>
            <SearchInputVue3 v-model:search="search" />
        </div>

        <div class="itemsList">
            <div v-for="burger in filteredBurgers" :key="burger.id" class="itemCard">
                <RouterLink :to="`/burger/${burger.id}`">
                    <h3>{{ burger.name }}</h3>
                    <img :src="burger.image" :alt="burger.name">
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.mainHeader {
    margin: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.itemsList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    align-items: center;
    justify-items: center;
    margin-bottom: 10px;
}

.itemCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    margin: 5px;
    padding: 10px;
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    box-shadow: 1px 1px var(--accent-color-2);
}

.itemCard:hover {
    background-color: var(--accent-color-2);
}

.itemCard img {
    width: 200px;
    margin-top: 5px;
    border-radius: 10px;
}
</style>