<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBurgers } from '@/composables';
import StarRating from '../components/StarRating.vue';

const search = ref('');

// Filter states
const activeIngredientFilters = ref([]);
const activeAllergenFilters = ref([]);

// Available filter options
const ingredientFilters = [
    { id: 'cheese', label: 'Cheese' },
    { id: 'bacon', label: 'Bacon' }
];

const allergenFilters = [
    { id: 'gluten', label: 'Gluten Free' },
    { id: 'dairy', label: 'Dairy Free' },
    { id: 'nuts', label: 'Nuts Free' },
    { id: 'sesame', label: 'Sesame Free' }
];

const { sortedBurgers, error, loading, loadBurgers } = useBurgers();

// Toggle filter function
const toggleFilter = (filterId, filterType) => {
    const filterArray = filterType === 'ingredient' ? activeIngredientFilters : activeAllergenFilters;

    if (filterArray.value.includes(filterId)) {
        filterArray.value = filterArray.value.filter(id => id !== filterId);
    } else {
        filterArray.value.push(filterId);
    }
};

// Check if text contains ingredient (case insensitive)
const containsIngredient = (text, ingredient) => {
    if (!text) return false;
    return text.toLowerCase().includes(ingredient.toLowerCase());
};

// Check if burger has ingredient
const burgerHasIngredient = (burger, ingredient) => {
    return containsIngredient(burger.ingredients, ingredient) ||
        containsIngredient(burger.more_ingredients, ingredient);
};

// Check if burger is free of allergen
const burgerIsFreeOfAllergen = (burger, allergen) => {
    // First, burger must have allergens information (not null/undefined/empty)
    if (!burger.allergens || burger.allergens.trim() === '') {
        return false; // If no allergen info, we can't confirm it's allergen-free
    }

    // Then check if the allergen is NOT mentioned in the allergens field
    return !containsIngredient(burger.allergens, allergen);
};

const filteredBurgers = computed(() => {
    // Use sortedBurgers directly from the composable
    return sortedBurgers.value.filter(burger => {
        // Apply text search filter
        const textMatch = search.value === '' ||
            burger.name.toLowerCase().includes(search.value.toLowerCase()) ||
            (burger.ingredients && burger.ingredients.toLowerCase().includes(search.value.toLowerCase())) ||
            (burger.bread && burger.bread.toLowerCase().includes(search.value.toLowerCase())) ||
            (burger.main_ingredient && burger.main_ingredient.toLowerCase().includes(search.value.toLowerCase())) ||
            (burger.more_ingredients && burger.more_ingredients.toLowerCase().includes(search.value.toLowerCase()));

        if (!textMatch) return false;

        // Apply ingredient filters
        const ingredientMatch = activeIngredientFilters.value.length === 0 ||
            activeIngredientFilters.value.every(ingredient => burgerHasIngredient(burger, ingredient));

        if (!ingredientMatch) return false;

        // Apply allergen filters
        const allergenMatch = activeAllergenFilters.value.length === 0 ||
            activeAllergenFilters.value.every(allergen => burgerIsFreeOfAllergen(burger, allergen));

        return allergenMatch;
    });
});

// Count how many burgers match each filter
const getFilterMatchCount = (filterId, filterType) => {
    // Create a temporary array with the filter added
    let tempFilters;

    if (filterType === 'ingredient') {
        tempFilters = [...activeIngredientFilters.value];
        if (!tempFilters.includes(filterId)) {
            tempFilters.push(filterId);
        }
    } else {
        tempFilters = [...activeAllergenFilters.value];
        if (!tempFilters.includes(filterId)) {
            tempFilters.push(filterId);
        }
    }

    // Count burgers that would match with this filter applied
    return sortedBurgers.value.filter(burger => {
        // Apply text search filter
        const textMatch = search.value === '' ||
            burger.name.toLowerCase().includes(search.value.toLowerCase()) ||
            (burger.ingredients && burger.ingredients.toLowerCase().includes(search.value.toLowerCase())) ||
            (burger.bread && burger.bread.toLowerCase().includes(search.value.toLowerCase())) ||
            (burger.main_ingredient && burger.main_ingredient.toLowerCase().includes(search.value.toLowerCase())) ||
            (burger.more_ingredients && burger.more_ingredients.toLowerCase().includes(search.value.toLowerCase()));

        if (!textMatch) return false;

        // Apply ingredient filters
        const ingredientFiltersToApply = filterType === 'ingredient' ? tempFilters : activeIngredientFilters.value;
        const ingredientMatch = ingredientFiltersToApply.length === 0 ||
            ingredientFiltersToApply.every(ingredient => burgerHasIngredient(burger, ingredient));

        if (!ingredientMatch) return false;

        // Apply allergen filters
        const allergenFiltersToApply = filterType === 'allergen' ? tempFilters : activeAllergenFilters.value;
        const allergenMatch = allergenFiltersToApply.length === 0 ||
            allergenFiltersToApply.every(allergen => burgerIsFreeOfAllergen(burger, allergen));

        return allergenMatch;
    }).length;
};

onMounted(() => {
    loadBurgers();
});
</script>

<template>
    <div class="listOfBurgers">
        <div class="mainHeader">
            <h3 v-if="!search">All the burgers</h3>
            <h3 v-else>Burgers with <span class="highlight">{{ search }}</span></h3>
            <input class="searchInput" type="text" v-model="search" placeholder="Search...">
        </div>

        <div class="filters-container">
            <div class="filter-section">
                <h4>Dietary Options:</h4>
                <div class="filter-buttons">
                    <button v-for="filter in allergenFilters" :key="filter.id" class="filter-button"
                        :class="{ active: activeAllergenFilters.includes(filter.id) }"
                        @click="toggleFilter(filter.id, 'allergen')">
                        {{ filter.label }}
                        <span class="count">({{ getFilterMatchCount(filter.id, 'allergen') }})</span>
                    </button>
                </div>
            </div>

            <div class="filter-section">
                <h4>Ingredients:</h4>
                <div class="filter-buttons">
                    <button v-for="filter in ingredientFilters" :key="filter.id" class="filter-button"
                        :class="{ active: activeIngredientFilters.includes(filter.id) }"
                        @click="toggleFilter(filter.id, 'ingredient')">
                        {{ filter.label }}
                        <span class="count">({{ getFilterMatchCount(filter.id, 'ingredient') }})</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="loading" class="loading">
            Loading burgers...
        </div>

        <div v-else-if="error" class="error">
            {{ error }}
        </div>

        <div v-else-if="filteredBurgers.length === 0" class="no-results">
            <p>No burgers match your filters. Try adjusting your search criteria.</p>
        </div>

        <div v-else class="itemsList">
            <div v-for="burger in filteredBurgers" :key="burger.id" class="itemCard">
                <RouterLink :to="`/burger/${burger.id}`" class="itemLink">
                    <h3>{{ burger.name }}</h3>
                    <img :src="burger.image" alt="burger.name">
                    <StarRating :rating="burger.rating" maxrating="5" />
                </RouterLink>
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
    margin: 20px 0 20px 40px;
    padding-right: 40px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px;
}

.mainHeader span {
    color: var(--text-color);
}

.highlight {
    color: var(--accent-color-2);
    font-weight: bold;
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
    border-color: var(--accent-color-1);
    box-shadow: 0 0 5px rgba(var(--accent-color-1-rgb), 0.5);
}

.filters-container {
    margin: 0 40px 20px 40px;
    padding: 15px;
    background-color: var(--accent-color-1);
    border: 2px solid var(--accent-color-2);
    border-radius: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.filter-section {
    margin-bottom: 0;
}

.filter-section h4 {
    margin: 0 0 10px 0;
    color: var(--accent-color-2);
}

.filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.filter-button {
    padding: 6px 12px;
    background-color: var(--background-color);
    color: var(--accent-color-2);
    border: 2px solid var(--accent-color-2);
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.filter-button:hover {
    background-color: var(--accent-color-2);
    color: var(--accent-color-1);
}

.filter-button.active {
    background-color: var(--accent-color-2);
    color: var(--accent-color-1);
}

.filter-button .count {
    font-size: 0.8rem;
    opacity: 0.8;
}

.loading {
    text-align: center;
    padding: 30px;
    color: var(--accent-color-2);
    font-size: 1.2rem;
}

.error {
    text-align: center;
    padding: 30px;
    color: #dc3545;
    background-color: var(--background-color);
    border: 2px solid #dc3545;
    border-radius: 10px;
    margin: 20px 40px;
}

.no-results {
    text-align: center;
    padding: 30px;
    background-color: var(--background-color);
    border: 2px solid var(--accent-color-2);
    border-radius: 10px;
    margin: 20px 40px;
    color: var(--accent-color-2);
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

@media only screen and (max-width: 768px) {
    .mainHeader {
        grid-template-columns: 1fr;
        margin: 20px 20px;
    }

    .searchInput {
        width: 100%;
        margin-left: 0;
    }

    .filters-container {
        margin: 0 20px 20px 20px;
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .filter-buttons {
        gap: 8px;
    }

    .filter-button {
        padding: 5px 10px;
        font-size: 0.8rem;
    }
}

@media only screen and (max-width: 600px) {
    h3 {
        font-size: 1rem;
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
