<script>
/* Come faccio ad utilizzare un componente dentro un altro?
        Si seguono 3 passaggi:
        1) Importazione del componente
        2) Dichiarazione del componente all'interno dell'oggetto
        3) Utilizzo del componente    
*/


export default {
    data(){
        return {
            links: [
                {
                    name: 'Home',
                    url: 'home'
                },     
                {
                    name: 'Appartamenti',
                    url: 'apartments.index'
                },                       
            ]
        }
        
    },
   
    methods: {

    }
}

</script>

<template>
     <header>
        <div class="header_container d-flex justify-content-between align-items-center">
            <div class="logo_container">
                <img src="/img/logo_vv.svg" alt="">
            </div>
            <div class="align-items-center justify-content-between">
                <nav>
                    <div class="d-none d-md-block mx-4">
                        <ul>
                            <li v-for="link in links">
                                <router-link :to="{ name: link.url }" class="text-decoration-none">
                                    <span>
                                        {{ link.name }}
                                    </span>
                                </router-link>
                            </li>
                            <div class="dropdown">
                                <button class="btn-secondary dropdown_button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-user"></i>
                                </button>
                                <ul class="dropdown-menu" style="margin:0;">
                                    <li>
                                        <a href="http://127.0.0.1:8000/login" class="text-decoration-none dropdown-item">
                                            <span>
                                                Login
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="http://127.0.0.1:8000/register" class="text-decoration-none dropdown-item">
                                            <span>
                                                Register
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>         
                        </ul>
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
