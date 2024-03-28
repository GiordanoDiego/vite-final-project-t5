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
            <div class="row">
                <div class="col-2 logo_container">
                    <div class="  ">
                        <img src="/img/logo_vv.svg" alt="">
                    </div>
                    <div>
                    </div>
                </div>
                <div class="col">
                    right
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
