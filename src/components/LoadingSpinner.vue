<template>
    <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>
</template>

<style scoped>
.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: var(--background-color);
    z-index: 9999;
}

.spinner {
    border: 6px solid #f3f3f3;
    border-top: 6px solid var(--accent-color-2);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

p {
    font-size: 1.2rem;
    color: var(--text-color);
}
</style>