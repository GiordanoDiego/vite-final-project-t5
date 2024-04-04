// Qui dentro ci scriviamo la configurazione di vue router
// che servirà per far sì che l'utente possa 'navigare' tra le nostre pagine

import { createRouter, createWebHistory } from "vue-router"; 

import IndexPage from './pages/IndexPage.vue';
import ApartmentPage from './pages/ApartmentPage.vue';
import SingleApartment from './pages/SingleApartment.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: IndexPage
        },
        {
            path: '/blog',
            name: 'apartments.index',
            component: ApartmentPage
        },
        {
            path: '/blog/:slug',
            name: 'apartments.show',
            component: SingleApartment
        },
        
    ]
});

export { router };