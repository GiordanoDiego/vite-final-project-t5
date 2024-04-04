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
        <div class="header_container">
            <div class="container">
                    <div class="logo_container">
                        <div class="  ">
                            <img src="/img/logo_vv.svg" alt="">
                            
                           
                            
                        </div>     
                    </div>
                <div class="row g-0 align-items-center justify-content-between">
                    <div class="col">
                        <nav>
                            <ul>
                                <li v-for="link in links">
                                    <router-link :to="{ name: link.url }" class="text-decoration-none">
                                    <span>{{ link.name }}</span> 
                                    </router-link>
                                </li>
                                <li><a href="http://127.0.0.1:8000/login">Login</a></li>
                                <li><a href="http://127.0.0.1:8000/register">Register</a></li>
                                                               
                            </ul>
                        </nav>  
                    </div>
                </div>
            </div>
        </div>
     </header>
</template>

<style lang="scss" scoped>
    @use'../assets/SCSS/main.scss';
    @use '../assets/SCSS/header.scss';

    
</style>
