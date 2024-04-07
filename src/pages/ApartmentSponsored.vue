<!-- QUESTO COMPONENTE HA TUTTI GLI APPARTAMENTI SPONSORIZZATI VISIONE GRIGLIA-->
<!-- PER UTILIZZARLO SI DEVE IMPORTARE DENTRO L'INDEXPAGE E UTILIZZARE UN VFOR -->
<script >

    export default {
        data() {
            return {
            };
        },
        methods: {

        },
        props: {   
            apartment: Object,
            api: String
        }

    }
</script>

<template>
    <!-- nuove cards -->
    
    <div class="col-12 col-md-6 col-lg-3 p-2">
        <div class="card h-100">
            <div class="img_container">
                <img :src="'http://127.0.0.1:8000/storage/' + apartment.cover_img" :alt="apartment.title" class="card-img-top img-fluid" style="height: 200px; object-fit: cover;">
            </div>
            <div class="card-body">
                <div class="card-text row">
                    <div class="col-12">
                        <strong>
                            {{ apartment.title }}
                        </strong>
                    </div>
                    <div class="col-12 address_container">
                        {{ apartment.address }} <!-- Modifica questa riga -->
                    </div>
                    <div class="col-12 d-flex justify-content-center mt-1">
                        <span v-for="service in apartment.services" :key="service.id" class="badge rounded-pill single_service">
                            <i :class="service.icon"></i>
                            <span class="tooltip-text">{{ service.title }}</span>
                        </span>
                    </div>
                    <div class="link-container">
                        <router-link :to="{ name: 'apartments.show', params: { slug: apartment.slug } }" class="btn show_single_apartment_button">
                            <span>Vai all'appartamento</span>            
                        </router-link>
                    </div>
                </div>
            </div>
        </div>                  
    </div> 
         

    
</template>

<style lang="scss" scoped>
@use '../assets/SCSS/partials/variables.scss' as *;
   
.card {

background-color: #FEFFFA;
transition: all 0.5s;
overflow: hidden;

&:hover{
    cursor: pointer;
    background-color: white;
    box-shadow: 0px 0px 10px 3px #252525;

    img {
        transition: transform 0.5s;
        transform: scale(1.1);
    }
}

.show_single_apartment_button{
    background-color: $button_background_color;
    color: white;
    padding: 2px 5px;
    margin-top: 8px;
    display: flex;
    justify-content: center;
}

.address_container{
    font-size: 0.8em;
}
.single_service {
    position: relative;
    margin-right: 3px;
    color: white;
    background-color: $button_background_color;
}

.tooltip-text {
    visibility: hidden;
    background-color: $button_background_color;
    color: white;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 100%;

    transform: translateX(-20%);
}

.single_service:hover .tooltip-text {
    visibility: visible;
}


}

</style>
