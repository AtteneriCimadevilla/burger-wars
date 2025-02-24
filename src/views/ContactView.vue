<script>
</script>

<template>
    <section id="form">
        <h1>Contact form</h1>
        <form id="contactForm" class="contactForm">
            <div class="name formField">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Enter your name..." required>
            </div>

            <div class="email formField">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your email..." required>
            </div>

            <div class="message formField">
                <label for="message">Message:</label>
                <textarea id="message" rows="6" name="message" placeholder="What's on your mind?" required></textarea>
            </div>
            <div class="submit">
                <button type="submit">Submit</button>
            </div>
        </form>
    </section>
</template>

<style scoped>
* {
    font-family: 'Roboto', sans-serif;
    color: var(--accent-color-2);
}

.contactForm {
    width: 80%;
    max-width: 600px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-family: 'Roboto', sans-serif;
}

.formField {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    input,
    textarea {
        padding: 0.5rem;
        border: 2px solid var(--accent-color-2);
        border-radius: 5px;
        box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
        color: var(--text-color);

        &:focus {
            outline: none;
            /* Remove default focus outline */
            border-color: var(--accent-color-1);
            /* Change border color on focus */
            box-shadow: 0 0 5px rgba(var(--accent-color-1-rgb), 0.5);
            /* Optional: add a subtle glow effect */
        }
    }
}

.submit {
    display: flex;
    justify-content: flex-end;

    button {
        padding: 0.5rem 1rem;
        background-color: var(--accent-color-2);
        color: var(--accent-color-1);
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: var(--accent-color-1);
            color: var(--accent-color-2);
        }
    }
}
</style>