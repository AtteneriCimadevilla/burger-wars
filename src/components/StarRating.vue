<script>
export default {
    props: {
        rating: {
            type: Number,
            required: true
        },
        maxRating: {
            type: Number,
            default: 5
        }
    },
    computed: {
        filledStars() {
            return (this.rating / this.maxRating) * 5;
        }
    }
}
</script>

<template>
  <div class="star-rating">
    <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= filledStars, 'half-filled': n === Math.ceil(filledStars) && !Number.isInteger(filledStars) }">
      ★
    </span>
  </div>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
}
.star {
  font-size: 24px;
  color: #e4e5e9;
}
.star.filled {
  color: var(--logo-color);
}
.star.half-filled {
  position: relative;
  color: #e4e5e9;
}
.star.half-filled::before {
  content: '★';
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
  color: var(--logo-color);
}

@media screen and (max-width: 550px) {
  .star {
    font-size: 14px;
  }
}
</style>