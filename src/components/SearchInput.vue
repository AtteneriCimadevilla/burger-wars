<script>
export default {
    name: 'SearchInput',
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    methods: {
        updateValue(value) {
            this.$emit('input', value)
        }
    }
}
</script>

<template>
    <div class="searchInput">
        <input
            type="text"
            :value="value"
            @input="updateValue($event.target.value)"
            placeholder="Search name or ingredient..."
        >
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
    transition: border-color 0.3s ease;
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