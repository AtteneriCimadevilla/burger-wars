<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  rating: {
    type: Number,
    required: true
  },
  maxRating: {
    type: Number,
    default: 5
  },
  interactive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:rating']);

const hoverRating = ref(0);

const filledStars = computed(() => {
  return props.interactive && hoverRating.value > 0
    ? hoverRating.value
    : props.rating;
});

const handleStarClick = (rating) => {
  if (props.interactive) {
    // Allow clicking the same star to set rating to 0
    if (props.rating === rating) {
      emit('update:rating', 0);
    } else {
      emit('update:rating', rating);
    }
  }
};

const handleStarHover = (rating) => {
  if (props.interactive) {
    hoverRating.value = rating;
  }
};

const handleMouseLeave = () => {
  hoverRating.value = 0;
};

const handleContainerClick = (event) => {
  // Allow clicking outside stars to set rating to 0
  if (props.interactive && event.target === event.currentTarget) {
    emit('update:rating', 0);
  }
};
</script>

<template>
  <div class="star-rating" :class="{ 'interactive': interactive }" @mouseleave="handleMouseLeave"
    @click="handleContainerClick">
    <span v-for="n in maxRating" :key="n" class="star" :class="{
      'filled': n <= filledStars,
      'half-filled': n === Math.ceil(filledStars) && !Number.isInteger(filledStars)
    }" @click.stop="handleStarClick(n)" @mouseover="handleStarHover(n)">
      ★
    </span>
    <span v-if="interactive" class="rating-text">{{ rating }}/{{ maxRating }}</span>
  </div>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.star {
  font-size: 24px;
  color: #e4e5e9;
  transition: transform 0.1s ease;
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

.interactive .star {
  cursor: pointer;
}

.interactive .star:hover {
  transform: scale(1.2);
}

.interactive {
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.interactive:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.rating-text {
  font-size: 0.9rem;
  color: var(--accent-color-2);
  font-weight: 600;
  margin-left: 0.5rem;
}

@media screen and (max-width: 600px) {
  .star {
    font-size: 18px;
  }

  .rating-text {
    font-size: 0.8rem;
  }
}
</style>
