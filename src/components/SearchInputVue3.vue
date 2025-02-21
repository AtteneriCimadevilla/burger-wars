<script setup>
import { ref } from 'vue'

const search = ref('')

const emit = defineEmits(['update:search'])

const updateSearch = (event) => {
    emit('update:search', event.target.value)
}
</script>

<template>
    <div class="searchInput">
        <input
            type="text"
            :value="search"
            @input="updateSearch"
            placeholder="Search...">
    </div>
</template>

<style scoped>
.searchInput {
    margin-left: 20px;
}

.searchInput input {
    padding: 5px;
    width: 200px;
    border: 2px solid var(--accent-color-2);
    border-radius: 5px;
}
</style>