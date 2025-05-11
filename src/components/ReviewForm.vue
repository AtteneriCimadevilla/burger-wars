<!-- src/components/ReviewForm.vue -->
<script setup>
import { ref } from 'vue'

const props = defineProps({
    burgerId: String,
    onSubmitted: Function
})

const taste = ref(5)
const presentation = ref(5)
const qualityPrice = ref(5)
const comment = ref('')

const error = ref('')
const success = ref(false)

const submitReview = async () => {
    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                burger_id: props.burgerId,
                taste_rating: taste.value,
                presentation_rating: presentation.value,
                quality_price_rating: qualityPrice.value,
                comment: comment.value
            })
        })

        if (!response.ok) throw new Error('Error submitting review')

        success.value = true
        error.value = ''
        taste.value = presentation.value = qualityPrice.value = 5
        comment.value = ''

        props.onSubmitted?.()
    } catch (err) {
        error.value = err.message
        success.value = false
    }
}
</script>

<template>
    <div class="review-form">
        <h3>Submit your review</h3>

        <div class="field">
            <label for="taste">Taste:</label>
            <input type="range" min="1" max="10" v-model="taste" />
            <span>{{ taste }}</span>
        </div>

        <div class="field">
            <label for="presentation">Presentation:</label>
            <input type="range" min="1" max="10" v-model="presentation" />
            <span>{{ presentation }}</span>
        </div>

        <div class="field">
            <label for="quality">Quality/Price:</label>
            <input type="range" min="1" max="10" v-model="qualityPrice" />
            <span>{{ qualityPrice }}</span>
        </div>

        <div class="field">
            <label for="comment">Comment:</label>
            <textarea v-model="comment" placeholder="Optional"></textarea>
        </div>

        <button @click="submitReview">Submit</button>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">Thanks for your review!</p>
    </div>
</template>

<style scoped>
.review-form {
    margin: 1rem 0;
}

.field {
    margin-bottom: 1rem;
}

.error {
    color: red;
}

.success {
    color: green;
}
</style>
