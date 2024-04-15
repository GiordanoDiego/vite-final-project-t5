

<script>
export default {
    data() {
        return {
           
           
        };
    },
    methods: {

    }
}
</script>

<template>
   <footer>
        <div class="container">
            <div class="row">
                <div class="col-6">
                    <ul>
                        <li>
                            © 2024 VacationVilla
                        </li>
                        <li>
                            -
                        </li>
                        <li>
                            <a href="">Privacy</a>
                        </li>
                        <li>
                            <a href="">Termini</a>
                        </li>
                        <li>
                            <a href="">Dettagli azienda</a>
                        </li>
                    </ul>
                </div>
                <div class="col-6">
                    <div class="d-flex justify-content-end ">
                        <div class="me-2 ">
                            <i class="fa-brands fa-square-facebook"></i>
                            <i class="fa-brands fa-square-twitter"></i>
                            <i class="fa-brands fa-square-instagram"></i>
                            <i class="fa-brands fa-square-whatsapp"></i>
                        </div>
                        <div class="me-2">
                            
                            <i class="fa-solid fa-globe"></i> Italiano
                        </div>
                        <div>
                            €
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </footer> 
    <!-- <footer  class="container-fluid">
       <hr> 
        <div class="container-md">
            <div class="row">
                

                <div class="col-3">
                    <div class="text-left">
                        <h5>Assistenza</h5>
                        <ul>
                            <li v-for="(pippo,i) in Assistenza" :key="i" >{{pippo.title}}</li>
                           
                        </ul>
                    </div>
                </div>


                <div class="col-3">
                    <div class="text-left">
                        <h5>Ospitare</h5>
                        <ul>
                            <li v-for="(pluto,i) in Ospitare" :key="i" >{{pluto.title}}</li>
                           
                        </ul>
                    </div>
                </div>


                <div class="col-3">
                    <div class="text-left">
                        <h5>Boolbnb</h5>
                        <ul>
                            <li v-for="(paperino,i) in Boolbnb" :key="i" >{{paperino.title}}</li>
                           
                        </ul>
                    </div>
                </div>

              

                
            </div>
        </div>

        
       
    </footer> -->
</template>

<style lang="scss" scoped>
    @use'../assets/SCSS/main.scss';
    @use '../assets/SCSS/footer.scss';


    i{
        margin: 2px;
    }
</style>
