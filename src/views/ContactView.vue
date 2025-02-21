<script>
</script>

<template>
    <section id="form">
        <h1>Contact Form</h1>
        <form id="contactForm" class="contactForm">
            <div class="name formField">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>

            <div class="email formField">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>

            <div class="message formField">
                <label for="message">Message:</label>
                <textarea id="message" rows="6" name="message" required></textarea>
            </div>
            <div class="submit">
                <button type="submit">Submit</button>
            </div>
        </form>
    </section>
</template>

<style scoped>
.contactForm {
    width: 80%;
    max-width: 600px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.formField {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.submit {
    display: flex;
    justify-content: flex-end;
}
</style>