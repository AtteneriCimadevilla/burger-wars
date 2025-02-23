import './assets/main.css'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import burgers from './assets/data/burgers.json'
import restaurants from './assets/data/restaurants.json'

import App from './App.vue'
import Home from './views/Home.vue'
import BurgerView from './views/BurgerView.vue'
import RestaurantsView from './views/RestaurantsView.vue'
import RestaurantView from './views/RestaurantView.vue'
import ListOfBurgers from './views/ListOfBurgers.vue'
import AboutUsView from './views/AboutUsView.vue'
import ContactView from './views/Contact.vue'

burgers.forEach(burger => {
    burger.rating = Math.round((burger.ratings.taste + burger.ratings.presentation + burger.ratings.quality_price) / 3 * 100) / 100.00;
});

burgers.sort((a, b) => b.rating - a.rating);

localStorage.setItem('burgers', JSON.stringify(burgers));
localStorage.setItem('restaurants', JSON.stringify(restaurants));

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/burgers',
            name: 'burgers',
            component: ListOfBurgers
        },
        {
            path: '/burger/:id',
            name: 'burger',
            component: BurgerView
        },
        {
            path: '/restaurants',
            name: 'restaurants',
            component: RestaurantsView
        },
        {
            path: '/restaurant/:id',
            name: 'restaurant',
            component: RestaurantView
        },
        {
            path: '/about',
            name: 'about',
            component: AboutUsView
        },
        {
            path: '/contact',
            name: 'contact',
            component: ContactView
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/'
        },
        {
            path: '/list',
            name: 'list',
            component: ListOfBurgers
        }
    ]
})

createApp(App)
    .use(router)
    .mount('#app')