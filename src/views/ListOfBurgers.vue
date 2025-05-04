<script>
import StarRating from '../components/StarRating.vue';
import { onMounted,ref, watchEffect } from 'vue';
import { useDataProcessor } from '../scripts/dataProcessor.js';

export default {
    components: { StarRating },
    setup() {
        const { burgers, isLoading, error, loadData } = useDataProcessor();
        const search = ref('');

        // Use onMounted to ensure loadData runs only once
        onMounted(() => {
            loadData();
        });

        const filteredBurgers = ref([]);

        // Watch for changes in burgers or search
        watchEffect(() => {
            if (!burgers.value?.length) {
                filteredBurgers.value = []; // Reset filteredBurgers if burgers is empty 
                return;
            }

            filteredBurgers.value = burgers.value.filter(burger => {
                if (!burger.name) return false;
                const matchesSearch =
                    burger.name.toLowerCase().includes(search.value.toLowerCase()) ||
                    burger.ingredients?.toLowerCase().includes(search.value.toLowerCase()) ||
                    burger.bread?.toLowerCase().includes(search.value.toLowerCase()) ||
                    burger.main_ingredient.toLowerCase().includes(search.value.toLowerCase()) ||
                    (burger.more_ingredients && burger.more_ingredients.toLowerCase().includes(search.value.toLowerCase()));

                return matchesSearch;
            });
        });

        return {
            search,
            filteredBurgers,
        };
    },
};
</script>

<template>
    <div class="listOfBurgers">
        <div class="mainHeader">
            <h3 v-if="!search">
                All the burgers
            </h3>
            <h3 v-else>
                Burgers with <span>{{ search }}</span>
            </h3>
            <input class="searchInput" type="text" v-model="search" placeholder="Search...">
        </div>

        <div v-if="isLoading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>

            <div class="itemsList">
                <div v-for="burger in filteredBurgers" :key="burger.id" class="itemCard">
                    <RouterLink :to="`/burger/${burger.id}`" class="itemLink">
                        <h3>{{ burger.name }}</h3>
                        <img :src="burger.image" alt="burger.name">
                        <StarRating :rating="parseFloat(burger.rating) || 0" maxrating="10" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.listOfBurgers {
    width: 90%;
    margin: 0 auto;
}

.mainHeader {
    margin: 20px 0 20px 20px;
    padding-right: 20px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px;
    /* This adds space between wrapped items */
}

.mainHeader span {
    color: var(--text-color);
}

.searchInput {
    margin-left: 20px;
    padding: 5px;
    width: 200px;
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
}

.searchInput:focus {
    outline: none;
    /* Remove default focus outline */
    border-color: var(--accent-color-1);
    /* Change border color on focus */
    box-shadow: 0 0 5px rgba(var(--accent-color-1-rgb), 0.5);
    /* Optional: add a subtle glow effect */
}

.itemCard {
    height: 300px;
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

@media only screen and (max-width: 550px) {
    h3 {
        font-size: 1rem;
    }

    .searchInput {
        width: 80%;
    }

    .itemCard {
        height: 200px;
    }
}

@media only screen and (max-width: 420px) {
    .listOfBurgers {
        width: 98%;
    }
}
</style>