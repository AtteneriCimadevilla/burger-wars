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
            <h2>
                List of Restaurants
            </h2>
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

.itemsList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    align-items: center;
    justify-items: center;
    margin-bottom: 10px;
}

.itemCard {
    width: 200px;
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
    width: 150px;
    margin-top: 5px;
    border-radius: 10px;
}
</style>