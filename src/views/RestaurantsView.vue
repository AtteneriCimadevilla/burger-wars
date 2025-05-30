<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRestaurants } from '@/composables';
import StarRating from '../components/StarRating.vue';

const search = ref('');
const restaurants = ref([]);
const { sortedRestaurants, error, loading, loadRestaurants } = useRestaurants()

onMounted(async () => {
    await loadRestaurants();
    restaurants.value = sortedRestaurants.value;
})

const filteredRestaurants = computed(() => {
    return sortedRestaurants.value.filter(restaurant => {
        const text = search.value.toLowerCase()
        return restaurant.name.toLowerCase().includes(text)
    })
})
</script>

<template>
    <div class="listOfRestaurants">
        <div class="mainHeader">
            <h3 v-if="!search">All the restaurants</h3>
            <h3 v-else>Filtered restaurants</h3>
            <div class="searchInput">
                <input type="text" v-model="search" placeholder="Search...">
            </div>
        </div>

        <div class="itemsList">
            <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="itemCard">
                <StarRating :rating="restaurant.rating" :maxrating="5" />
                <RouterLink :to="`/restaurant/${restaurant.id}`" class="itemLink">
                    <img :src="restaurant.image" :alt="restaurant.name">
                    <h4 class="itemName">{{ restaurant.name }}</h4>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.listOfRestaurants {
    width: 90%;
    margin: 0 auto;
}
.mainHeader {
    margin: 20px 0 20px 20px;
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

@media only screen and (max-width: 600px) {
    .mainHeader {
        display: grid;
        grid-template-columns: 1fr auto;
    }
    .searchInput input {
        width: 80%;
    }

}

.itemCard {
    height: 310px;
}
.itemLink {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.itemLink img {
    width: 90%;
    height: 90%;
    object-fit: cover;
    border-radius: 5px;
}
.itemName {
    text-align: center;
    word-wrap: break-word;
}
@media screen and (max-width: 600px) {
    .itemsList {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .itemCard {
        width: 150px;
        height: 220px;
    }

    .itemCard img {
        width: 120px;
        height: 120px;
    }

    .itemCard h3 {
        font-size: 1rem;
    }
}
</style>