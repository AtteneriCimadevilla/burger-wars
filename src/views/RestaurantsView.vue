<script>
const restaurantsList = JSON.parse(localStorage.getItem('restaurants'));
export default {
    data() {
        return {
            restaurants: restaurantsList,
            search: '',
        }
    },
    computed: {
        filteredRestaurants() {
            return this.restaurants.filter(restaurant => {
                const matchesSearch = restaurant.name.toLowerCase().includes(this.search.toLowerCase());
                return matchesSearch;
            })
        }
    }
}
</script>

<template>
    <div>
        <div class="mainHeader">
            <h3 v-if="!search">All the restaurants</h3>
            <h3 v-else>Filtered restaurants</h3>
            <div class="searchInput">
                <input type="text" v-model="search" placeholder="Search...">
            </div>
        </div>

        <div class="itemsList">
            <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="itemCard">
                <RouterLink :to="`/restaurant/${restaurant.id}`">
                    <img :src="restaurant.image" :alt="restaurant.name">
                    <h3>{{ restaurant.name }}</h3>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.mainHeader {
    margin: 20px;
    padding-right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* This will vertically center the items */
    flex-wrap: wrap;
    /* This allows items to wrap on smaller screens */
    gap: 10px;
    /* This adds space between wrapped items */
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

@media only screen and (max-width: 550px) {
    .mainHeader {
        display: grid;
        grid-template-columns: 1fr auto;
    }

    .searchInput input {
        width: 80%;
    }

}
</style>