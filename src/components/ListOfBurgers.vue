<script>
import StarRating from './StarRating.vue';
const burgersList = JSON.parse(localStorage.getItem('burgers'));

export default {
    data() {
        return {
            burgers: burgersList,
            search: '',
        }
    },
    computed: {
        filteredBurgers() {
            return this.burgers.filter(burger => {
                const matchesSearch = burger.name.toLowerCase().includes(this.search.toLowerCase()) || burger.ingredients.toLowerCase().includes(this.search.toLowerCase());
                return matchesSearch;
            });
        }
    },
    components: {
        StarRating
    }
}
</script>

<template>
    <div>
        <div class="mainHeader">
            <h3 v-if="!search">
                All the burgers
            </h3>
            <h3 v-else>
                Burgers with <span>{{ search }}</span>
            </h3>
            <div class="searchInput">
                <input type="text" v-model="search" placeholder="Search...">
            </div>
        </div>

        <div class="itemsList">
            <div v-for="burger in filteredBurgers" :key="burger.id" class="itemCard">
                <RouterLink :to="`/burger/${burger.id}`">
                    <h3>{{ burger.name }}</h3>
                    <img :src="burger.image" alt="burger.name">
                    <StarRating :rating="burger.rating" maxrating="10"/>
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
    /* This will vertically center the items */
    flex-wrap: wrap;
    /* This allows items to wrap on smaller screens */
    gap: 10px;
    /* This adds space between wrapped items */
}
.mainHeader h3 {
    color: var(--accent-color-2);
}
.mainHeader span {
    color: var(--accent-color-1);
}

.searchInput {
    margin-left: 20px;
}

.searchInput input {
    padding: 5px;
    width: 200px;
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
}
.searchInput input:focus {
    outline: none;
    /* Remove default focus outline */
    border-color: var(--accent-color-1);
    /* Change border color on focus */
    box-shadow: 0 0 5px rgba(var(--accent-color-1-rgb), 0.5);
    /* Optional: add a subtle glow effect */
}
</style>