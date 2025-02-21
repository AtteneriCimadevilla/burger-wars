<script>
import ListOfMovies from '../components/ListOfMovies.vue';
const movieList = JSON.parse(localStorage.getItem('movieList'));
export default {
    data() {
        return {
            movies: movieList
        }
    },
    components: {
        ListOfMovies
    }
}
</script>

<template>
    <ListOfMovies type="movie" />
</template>

<style scoped></style>