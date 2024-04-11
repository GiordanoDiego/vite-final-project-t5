<script >
import axios from 'axios';
import ApartmentCard from './ApartmentCard.vue';
import ApartmentSponsored from './ApartmentSponsored.vue';
import ApartmentSponsoredSwiper from './ApartmentSponsoredSwiper.vue';
import { RouterView } from 'vue-router';
import { store } from '../store';


    export default {
        data() {
            return {
                store,
                // Definisco una variabile che utilizzerò per filtrare per nome dell'appartamento
                filterTitle: '',
                // Definisco una variabile che utilizzerò per filtrare per indirizzo
                // searchAddress: '',
                // Definisco un array vuoto per i suggerimenti degli indirizzi
                suggestions: [],
            };
        }, 
        components: {
            ApartmentCard,
            ApartmentSponsored,
            ApartmentSponsoredSwiper,
            RouterView,
        },
        computed: {
            // Definisco una funzione per gli appartamenti sponsorizzati
            sponsoredApartments() {
                return this.store.apartments.filter(apartment => apartment.sponsors.length > 0);
                }
             },
        methods: {
            // Definisco una funzione per ottenere i suggerimenti di indirizzo dall'API di TomTom
            async getSuggestionsFromAddress(address) {
                try {
                    const apiKey = 'x5vTIPGVXKGawffLrAoysmnVC9V0S8cq';
                    const response = await axios.get(`https://api.tomtom.com/search/2/search/${encodeURIComponent(address)}.json?key=${apiKey}`);
                    const suggestions = response.data.results.map(result => result.address.freeformAddress);
                    this.suggestions = suggestions;
                } catch (error) {
                    console.error('Si è verificato un errore durante il recupero dei suggerimenti:', error);
                }
            },
            // Definisco una funzione per selezionare un suggerimento  
            handleInput() {
                if (this.store.searchAddress.trim() !== '') {
                    this.getSuggestionsFromAddress(this.store.searchAddress);
                } else {
                    this.suggestions = [];
                }
            },
            selectAddress(address) {
                this.store.searchAddress = address;
                this.suggestions = []; // Nascondi la lista dei suggerimenti una volta selezionato un indirizzo
            },  
            // Definico una funzione per ottenere le coordinate dall'indirizzo utilizzando l'API di TomTom
            // async getCoordinatesFromAddress(address) {
            //     const apiKey = 'x5vTIPGVXKGawffLrAoysmnVC9V0S8cq';
            //     const response = await axios.get(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${apiKey}`);
            //     const { lat, lon } = response.data.results[0].position;
            //     return { lat, lon };
            // },
            // Definisco una funzione per calcolare la distanza in km tra due coppie di coordinate
            // calculateDistance(lat1, lon1, lat2, lon2) {
            //     // Raggio medio della Terra in chilometri
            //     const R = 6371;
            //     const dLat = this.degreesToRadians(lat2 - lat1);
            //     const dLon = this.degreesToRadians(lon2 - lon1);
            //     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            //             Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
            //             Math.sin(dLon / 2) * Math.sin(dLon / 2);
            //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            //     // Distanza in chilometri
            //     const distance = R * c; 
            //     return distance;
            //  },
            // Definisco una funzione per convertire un angolo in un radiante
            // degreesToRadians(degrees) {
            //     return degrees * (Math.PI / 180);
            // },
            // Definisco una funzione per recuperare tutti gli appartamenti dal DB
            getApartments() {
                axios.get('http://127.0.0.1:8000/api/apartments/')
                    .then(res => {
                        console.log(res.data);

                        this.store.apartments = res.data.results;
                        this.store.originalApartments = [...this.store.apartments];
                        console.log(this.store.apartments);
                    })
                    .catch(error => {
                    console.error('Errore durante il recupero degli appartamenti:', error);
                });
            },
        },
        mounted() {
            // Alla creazione della pagina richiamo tutti gli appartamenti
            this.getApartments();
        }
    }
</script>

<template>

    <!-- card con appartamenti sponsorizzate con background verde chiaro -->
    <div class="container">
        
        <div class="row g-0">
            
            <div>
                <ApartmentSponsoredSwiper/>
                <hr>
            </div>
             
            <!-- Filtro per indirizzo -->
            <div class="row g-0 justify-content-center align-items-center mb-2 mt-2">
                <div class="col-4 my-container">
                    <span class="input-with-button">
                        <input v-model="store.searchAddress" @input="handleInput" list="suggestions" type="text" class="w-100 border-0" placeholder="Inserisci un indirizzo...">
                        <router-link :to="{ name:'apartments.search'}"  class="row g-0 justify-content-center align-items-center mb-2 mt-2">
                            <button class="go-button">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </router-link>
                        <ul v-if="suggestions.length > 0" class="list-group search-suggestions">
                            <li v-for="suggestion in suggestions" :key="suggestion" class="list-group-item" @click="selectAddress(suggestion)">{{ suggestion }}</li>
                        </ul>
                    </span>
                </div>
            </div>

            <!-- tutti gli appartamenti -->
            <ApartmentCard v-for="singleApartment in store.apartments" :key="singleApartment.id" :apartment="singleApartment" class="apartment-card"/>

        </div>
    </div>


</template>

<style lang="scss" scoped>
    @import '../assets/SCSS/partials/variables.scss';
    .apartment-card-sponsored{
        background-color: aquamarine;
    }

    .my-container {
        cursor: pointer;
        border: 0.5px solid rgba(0, 0, 0, 0.521);
        border-radius: 50px;
        position: relative;
        .input-with-button {
            display: flex;
            align-items: center;

            input:focus {
                outline: none; 
                border-color: #ced4da; 
            }

            input {
                padding: 4px;
                border-radius: 50px;
            }

            .go-button {
                border: 0;
                padding: 4px 8px;
                border-radius: 50px;
                background-color: #ea4c89f8;
                color: white;
            }

        }

        .search-suggestions {
            background-color: #ffffff;
            border-radius: 5px;
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
            position: absolute;
            top: 100%;
        } 

            .search-suggestions li {
            padding: 5px;
            cursor: pointer;
            }

            .search-suggestions li:hover {
            background-color: #f0f0f0;
        }

    }
    .go-button:hover, .my-container:hover{
        box-shadow: 0px 0px 5px 1px #000000;
    }

</style>