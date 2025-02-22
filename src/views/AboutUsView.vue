<script>
</script>

<template>
    <div class="aboutUsView">
        <section class="aboutUsParagraph">
            <p>
                Welcome to Burger Wars, your ultimate destination for discovering and comparing the best burgers in
                town! Our mission is to make it easy for burger enthusiasts like you to find their next favorite
                meal.
            </p>
            <p>
                Burger Wars was created by passionate food lovers who wanted to flip the traditional restaurant
                selection process on its head. Instead of choosing a restaurant first and then deciding what to eat,
                we let you pick your ideal burger first and find the perfect place to enjoy it.
            </p>
        </section>

        <section class="aboutUsParagraph">
            <h3>Our Mission</h3>
            <div>
                <p>
                    At Burger Wars, we aim to:
                </p>
                <ul>
                    <li>Promote the love for burgers and elevate the burger-eating experience.</li>
                    <li>Provide an intuitive platform for users to explore and compare burgers from different
                        restaurants.</li>
                    <li>Create a community where burger lovers can share their experiences and recommendations.</li>
                </ul>
            </div>
        </section>

        <section class="aboutUsParagraph">
            <h3>The Team Behind Burger Wars</h3>
            <p>
                Burger Wars is developed by Atteneri María Rodríguez Sánchez as part of the "Desarrollo de
                Interfaces Web" course in the second year of the "Desarrollo de Aplicaciones Multiplataforma"
                program at IES El Pla. Under the guidance of Professor Luis Alemañ Fillol, this project combines
                technical skills with a passion for great food.
            </p>
            <p>
                The application is built using modern web technologies such as HTML5, CSS, JavaScript, and the
                Vue.js framework. It is designed to be user-friendly, visually appealing, and accessible to all.
            </p>
        </section>

        <section class="aboutUsParagraph">
            <h3>Get in Touch</h3>
            <p>
                If you have any questions or feedback about Burger Wars, feel free to reach out to us!
            </p>
            <address>
                <p>
                    GitHub Repository: <a class="github" href="https://github.com/AtteneriCimadevilla/proyecto-interfaces-vue.git"
                        target="_blank">https://github.com/AtteneriCimadevilla/proyecto-interfaces.git</a>
                </p>
                <p>
                    Email: <a href="mailto:atteneri@example.com">atteneri@example.com</a>
                </p>
            </address>
        </section>
    </div>
</template>



<style scoped>
.aboutUsView {
    width: 80%;
    margin: 30px auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.aboutUsView p, li {
    font-size: 0.7rem;
    line-height: 1.5;
}

.aboutUsParagraph {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 20px;
    border: 3px solid var(--accent-color-2);
    border-radius: 10px;
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
}

.aboutUsView ul {
    list-style-type: disc;
    padding-left: 20px;
}

.github {
font-size: 0.7rem;
}

@media only screen and (min-width: 1024px) {
    .aboutUsView {
        gap: 100px;
    }
}
</style>