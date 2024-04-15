<script>
/* Come faccio ad utilizzare un componente dentro un altro?
        Si seguono 3 passaggi:
        1) Importazione del componente
        2) Dichiarazione del componente all'interno dell'oggetto
        3) Utilizzo del componente    
*/
import { RouterView } from 'vue-router';

export default {
    data(){
        return {
            links: [
                {
                    name: 'Home',
                    url: 'home'
                },     
                // {
                //     name: 'Appartamenti',
                //     url: 'apartments.index'
                // },                       
            ]
        }
        
    },
   
    methods: {

    },
    components: {
        RouterView
    }
}

</script>

<template>
    <header class="shadow">
        <div class="row justify-content-between ">
            <div class="col-3">
                <div class="d-flex align-items-center me-3  ">
                    <!-- <a href="http://localhost:5174" class="link_home_container"> -->
                    <router-link :to="{ name: 'home' }" class="link_home_container">
                        <!-- <i class="fa-solid fa-house"></i> -->
                        <span><i class="fa-solid fa-house"></i></span>
                        <span class="d-none  d-md-inline-block ms-1 "> home</span>
                    </router-link>
                    <!-- </a> -->
                </div>
            </div>
            <div class="col-6 d-md-none logo_container d-flex justify-content-center ">
                <!-- <a href="http://localhost:5174"> -->
                <router-link :to="{ name: 'home' }">
                    <img src="/img/logo_VV_ridimensionato.svg" alt="">
                </router-link>
                <!-- </a> -->
            </div>
            <div class="col-6 d-flex name_container d-none d-md-flex justify-content-center ">
                <!-- <a href="http://localhost:5174"> -->
                <router-link :to="{ name: 'home' }">
                    <img src="/img/vvilla_header.svg" alt="">
                </router-link>
                <!-- </a> -->
            </div>

            <div class="col-3 align-items-center justify-content-between">
                <nav>
                    <div class="d-flex justify-content-end align-content-center ">
                        
                        <div class="d-flex justify-content-center align-items-center me-3 " role="group">
                            <div class="dropdown">
                                <button class="btn dropdown_button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-bars me-3"></i>
                                    <i class="fa-solid fa-user"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item" href="http://127.0.0.1:8000/login">
                                            Login
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="http://127.0.0.1:8000/register">
                                            Register
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>              
            </div>
        </div>
     </header>
    
</template>

<style lang="scss" scoped>
    @use'../assets/SCSS/main.scss';
    @use '../assets/SCSS/header.scss';

    
</style>
