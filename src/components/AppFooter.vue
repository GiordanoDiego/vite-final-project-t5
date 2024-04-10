

<script>
export default {
    data() {
        return {
            Assistenza: [
                {
                    title: "Centro Assistenza"
                    
                },
                {
                    title: "AirCover"
                },
                {
                    title: "Antidiscriminazione"
                },
                {
                    title: "Supporto alla disabilità"
                },
                {
                    title: "Opzioni di cancellazione"
                },
                {
                    title: "Segnala problema nel quartiere"
                },
                
            ],
            Ospitare: [
                {
                    title: "Apri un Boolbnb"
                    
                },
                {
                    title: "AirCover per gli host"
                },
                {
                    title: "Risorse per gli host"
                },
                {
                    title: "Forum della community"
                },
                {
                    title: "Ospitare responsabilmente"
                },
                {
                    title: "Partecipa a una lezione gratuita sull'ospitalità"
                },
                
            ],
            Boolbnb: [
                {
                    title: "Newsroom"
                    
                },
                {
                    title: "Nuove funzionalità"
                },
                {
                    title: "Opportunità di lavoro"
                },
                {
                    title: "Investitori"
                },
                {
                    title: "Gift card"
                },
                {
                    title: "Soggiorni con Airbnb.org"
                },
                
            ],
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
                            <a href="">Privay</a>
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



</style>
