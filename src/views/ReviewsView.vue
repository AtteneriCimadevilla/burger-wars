<script>
export default {
    data() {
        return {
            // Datos iniciales del formulario
            contactForm: {
                name: "",
                email: "",
                message: "",
            },
            // Lista para mostrar los datos guardados
            savedContacts: JSON.parse(localStorage.getItem("contacts")) || [],
        };
    },
    methods: {
        // Método para manejar el envío del formulario
        handleSubmit() {
            // Agregar los datos del formulario a la lista de contactos guardados
            this.savedContacts.push({ ...this.contactForm });
            // Guardar la lista actualizada en el localStorage
            localStorage.setItem("contacts", JSON.stringify(this.savedContacts));
            // Reiniciar el formulario
            this.contactForm = {
                name: "",
                email: "",
                message: "",
            };
        },
        // Método para editar un contacto existente
        handleEdit(index) {
            // Cargar los datos del contacto en el formulario para editar
            this.contactForm = { ...this.savedContacts[index] };
            // Eliminar el contacto actual de la lista para que se pueda actualizar después
            this.savedContacts.splice(index, 1);
        },
    },
};
</script>

<template>
    <div>
        <!-- Formulario de contacto -->
        <form class="contactForm" @submit.prevent="handleSubmit">
            <h1>Reviews</h1>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" v-model="contactForm.name" placeholder="Enter your name..."
                required />
            <br />
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" v-model="contactForm.email" placeholder="Enter your email..."
                required />
            <br />
            <label for="message">Message:</label>
            <textarea id="message" name="message" v-model="contactForm.message" placeholder="Enter your message..."
                required></textarea>
            <br />
            <button type="submit">Send</button>
        </form>

        <!-- Lista de contactos guardados -->
        <div v-if="savedContacts.length > 0">
            <h2>Saved reviews</h2>
            <ul>
                <li v-for="(contact, index) in savedContacts" :key="index">
                    <p><strong>Name:</strong> {{ contact.name }}</p>
                    <p><strong>Email:</strong> {{ contact.email }}</p>
                    <p><strong>Message:</strong> {{ contact.message }}</p>
                    <button @click="handleEdit(index)">Edit</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
/* Estilo general */
body {
    font-family: Roboto, sans-serif;
    background-color: var(--background-color);
    color: #333;
    margin: 0;
    padding: 0;
}

/* Contenedor del formulario */
.contactForm {
    max-width: 500px;
    margin: 40px auto;
    padding: 30px;
    border-radius: 10px;
    background: var(--background-color);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.contactForm h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: var(--accent-color-2);
}

.contactForm label {
    font-weight: bold;
    display: block;
    margin: 10px 0 5px;
    text-align: left;
    color: var(--accent-color-2);
}

.contactForm input,
.contactForm textarea {
    font-family: inherit;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

.contactForm input:focus,
.contactForm textarea:focus {
    outline: none;
    border-color: var(--accent-color-2);
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.contactForm button {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    background: var(--accent-color-2);
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.contactForm button:hover {
    background: var(--accent-color-1);
}

/* Lista de contactos guardados */
h2 {
    text-align: center;
    color: var(--accent-color-2);
    margin-top: 30px;
}

ul {
    max-width: 500px;
    margin: 20px auto;
    padding: 0;
    list-style: none;
}

li {
    background: var(--background-color);
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

li:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

li p {
    margin: 8px 0;
}

li strong {
    color: #555;
}

button {
    padding: 10px 15px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #218838;
}

button:active {
    transform: scale(0.98);
}
</style>