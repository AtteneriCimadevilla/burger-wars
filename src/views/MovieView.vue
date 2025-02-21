<script>
import StarRating from '@/components/StarRating.vue';
const movieList = JSON.parse(localStorage.getItem('movieList'));

export default {
    props: ['id'],
    data() {
        return {
            movies: movieList
        }
    },
    computed: {
        currentMovie() {
            return this.movies.find(movie => movie.imdbID === this.$route.params.id) || null;
        }
    },
    components: {
        StarRating
    }
}
</script>

<template>
    <div v-if="currentMovie" class="movie-details">
        <div class="movieHeader">
            <img :src="currentMovie.Poster" :alt="currentMovie.Title" class="poster">
            <div class="titleAndPlot">
                <h3>{{ currentMovie.Title }}</h3>
                <p class="plot">{{ currentMovie.Plot }}</p>
            </div>
        </div>
        <div class="additional-info">
            <p><strong>Year:</strong> {{ currentMovie.Year }}</p>
            <p><strong>Director:</strong> {{ currentMovie.Director }}</p>
            <p><strong>Actors:</strong> {{ currentMovie.Actors }}</p>
            <p><strong>Genre:</strong> {{ currentMovie.Genre }}</p>
            <StarRating :rating="parseFloat(currentMovie.imdbRating)" :max-rating="10" />
        </div>
    </div>
    <div v-else class="error-message">
        <p>Movie not found</p>
    </div>
</template>

<style scoped>
.movie-details {
    width: 80%;
    max-width: 600px;
    margin: 10px auto;
    padding: 20px;
    background-color: var(--text-color);
    color: var(--background-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.movieHeader {
    display: grid;
    grid-template-columns: auto 1fr;
}

.titleAndPlot {
    margin-left: 20px;
}

h3 {
    font-size: 2rem;
    margin-bottom: 10px;
}

.poster {
    max-width: 150px;
    height: auto;
    display: block;
    margin: 0 auto 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.plot {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 20px;
}

.additional-info {
    background-color: var(--background-color);
    color: var(--accent-color);
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    line-height: 1.2;
}

.additional-info p {
    margin: 10px 0;
    font-size: 1rem;
}
.additional-info strong {
    font-weight: bold;
}

.error-message {
    text-align: center;
    font-size: 1.2rem;
    color: #d32f2f;
    margin-top: 50px;
}
</style>