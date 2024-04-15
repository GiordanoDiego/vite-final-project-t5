
<script >
import { computed } from 'vue';
import { store } from '../store';


    export default {
        data() {
            return {
                //price : apartment.price
                store
            };
        },
        methods: {
        },
        computed: {
            priceInteger() {
            return Math.floor(this.apartment.price);
            },
            // Calcolo della parte decimale del prezzo
            priceDecimal() {
            return (this.apartment.price % 1).toFixed(2).substring(1);
            },
            
        },
        props: {   
            apartment: Object,
            api: String
        },

    };
    

    
</script>
 
<template>
    <!-- nuove cards -->
    <div class="col-12 col-md-6 col-lg-3 p-2">
        <div class="card h-100">
            <router-link :to="{ name: 'apartments.show', params: { slug: apartment.slug } }" class="btn p-0">
                <div class="img_container">
                    <div v-if="apartment.latestSponsorship" class="latest-sponsorship rounded-pill">
                        Amato dagli ospiti
                    </div>
                    <img :src="'http://127.0.0.1:8000/storage/' + apartment.cover_img" :alt="apartment.title" class="card-img-top">
                </div>
                <div class="card-body text-start">
                    <div class="card-text row">
                        <div class="col-12">
                            <strong>
                                {{ store.truncateString(apartment.title, 25) }}
                            </strong>
                        </div>
                        <div class="col-12 address_container">
                            {{ store.truncateString(apartment.address, 30) }} <!-- Modifica questa riga -->
                        </div>
                        <div class="mt-2 mb-2 carateristic">
                            <span>
                                {{ apartment.n_rooms }} 
                                <abbr title="camere">
                                    <i class="fa-solid fa-person-shelter"></i>
                                </abbr>
                                • 
                            </span> 
                            <span>
                                {{ apartment.n_beds }}
                                <abbr title="letti">
                                    <i class="fa-solid fa-bed px-1"></i>
                                </abbr>
                                • 
                            </span> 
                            <span> 
                                {{ apartment.n_baths }}  
                                <abbr title="bagni">
                                    <i class="fa-solid fa-bath px-1 "></i>
                                </abbr>
                                • 
                            </span>
                            <span>
                                {{ apartment.mq }} mq
                            </span>  
                        </div>
                        <div  class="d-flex justify-content-between align-items-center">
                            
                            <div>
                                <span  class="price-integer fw-bold">{{ priceInteger }}</span>
                                <span class="price-decimal ">{{ priceDecimal }} </span>
                                
                                <span>
                                    € / Notte
                                </span>
                            </div>

                            <div v-if="store.distance" class="fw-light distance text-end">
                                    {{ Math.round(apartment.distance * 100) / 100 }} km
                            </div>

                        </div>
                    </div>
                </div>

            </router-link>
        </div>                  
    </div> 
    
    <!-- <div class="col-12 d-flex justify-content-center mt-1">
        <span v-for="service in apartment.services" :key="service.id" class="badge rounded-pill single_service">
            <i :class="service.icon"></i>
            <span class="tooltip-text">{{ service.title }}</span>
        </span>
    </div> -->
    <!-- <div class="link-container">
        
    </div> -->
         

    
</template>

<style lang="scss" scoped>
@use '../assets/SCSS/partials/variables.scss' as *;
   
.card {

    background-color: #FFFFFF;
    transition: all 0.5s;
    overflow: hidden;
    border: none;
    border-radius: 20px;

    .carateristic {
        font-size: smaller;
        color: gray;
    }

    .distance {
        font-size: 16px;
        line-height: 14px;
    }
    .img_container {
        position: relative;
        overflow: hidden;

        .latest-sponsorship {
            position: absolute;
            top: 10px;
            background-color: white;
            border-radius: 5px;
            padding: 2px 4px;
            left: 10px;
            font-size: 12px; /* Modifica la dimensione del testo secondo le tue preferenze */
            z-index: 999;
        }
        img{
            // border-radius: 20px;
            height: 200px;
            object-fit: cover;

            transition: transform 0.5s;
        }


    }



    &:hover{
        cursor: pointer;
        background-color: white;
        // box-shadow: 0px 0px 10px 3px #252525;
        transform: scale(1.05);

         .latest-sponsorship {
            transition: transform 0.5s;
            transform: scaleX(1.05) scaleY(1.05);
         }

        img {
            transition: transform 0.5s;
            transform: scale(1.1);
        }
    }

    .address_container{
        font-size: 0.8em;
    }
    .price-integer {
        font-size: 20px; 
    }

    .price-decimal {
       font-size: 12px; 
    }
    // .show_single_apartment_button{
    //     background-color: $button_background_color;
    //     color: white;
    //     padding: 2px 5px;
    //     margin-top: 8px;
    //     display: flex;
    //     justify-content: center;
    // }

    // .single_service {
    //     position: relative;
    //     margin-right: 3px;
    //     color: white;
    //     background-color: $button_background_color;
    // }

    // .tooltip-text {
    //     visibility: hidden;
    //     background-color: $button_background_color;
    //     color: white;
    //     text-align: center;
    //     border-radius: 6px;
    //     padding: 5px;
    //     position: absolute;
    //     z-index: 1;
    //     bottom: 100%;

    //     transform: translateX(-20%);
    // }

    // .single_service:hover .tooltip-text {
    //     visibility: visible;
    // }


}

</style>
