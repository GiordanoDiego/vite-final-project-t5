<script >
import axios from 'axios';
import ApartmentCard from './ApartmentCard.vue';
import ApartmentSponsored from './ApartmentSponsored.vue';
import ApartmentSponsoredSwiper from './ApartmentSponsoredSwiper.vue';
import { RouterView } from 'vue-router';

    export default {
        data() {
            return {
                apartments: [],
                filterTitle: '',
                searchAddress: '',
                suggestions: [],
                minRooms: '',
                minBeds: '', 
                roomOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '10'],
                bedOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '10'],
                searchRadius: '20', 
                radiusOptions: ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50'], 
                // Creo una flag per la visibilità dello swiper
                showSwiper: true,
                // Creo una flag per la visibilità dei filtri
                showFilters: false,
            };
        }, 
        components: {
            ApartmentCard,
            ApartmentSponsored,
            ApartmentSponsoredSwiper,
            RouterView,
        },
        computed: {
            sponsoredApartments() {
                return this.apartments.filter(apartment => apartment.sponsors.length > 0);
                }
             },
        methods: {
            // Creo una funzione che filtri i risultati in base all'indirizzo scelta dall'utente
            async filterByAddress() {
                try {
                    const { lat, lon } = await this.getCoordinatesFromAddress(this.searchAddress);
                    const filteredApartments = this.apartments.filter(apartment => {
                        const distance = this.calculateDistance(lat, lon, apartment.lat, apartment.lon);
                        // Filtra solo gli appartamenti entro 20 km dall'indirizzo scelto
                        return distance <= 20; 
                    });
                    this.apartments = filteredApartments;
                    // Cambia il valore della flag per lo swiper
                    this.showSwiper = false;
                    // Cambia il valore della flag per i filtri
                    this.showFilters = true;
                } catch (error) {
                    console.error('Errore durante il filtro degli appartamenti:', error);
                }
            },
            // Funzione per ottenere i suggerimenti di indirizzo dall'API di TomTom
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
            // Aggiungi questo metodo per gestire l'evento input e ottenere i suggerimenti
            handleInput() {
                if (this.searchAddress.trim() !== '') {
                    this.getSuggestionsFromAddress(this.searchAddress);
                } else {
                    this.suggestions = [];
                }
            },
            // Funzione per ottenere le coordinate dall'indirizzo utilizzando l'API di TomTom
            async getCoordinatesFromAddress(address) {
                const apiKey = 'x5vTIPGVXKGawffLrAoysmnVC9V0S8cq';
                const response = await axios.get(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${apiKey}`);
                const { lat, lon } = response.data.results[0].position;
                return { lat, lon };
            },
            // Funzione per calcolare la distanza in km tra due coppie di coordinate
            calculateDistance(lat1, lon1, lat2, lon2) {
                const R = 6371; // Raggio medio della Terra in chilometri
                const dLat = this.degreesToRadians(lat2 - lat1);
                const dLon = this.degreesToRadians(lon2 - lon1);
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c; // Distanza in chilometri
                return distance;
             },
            degreesToRadians(degrees) {
                return degrees * (Math.PI / 180);
            },
            getApartments() {
                axios.get('http://127.0.0.1:8000/api/apartments/')
                    .then(res => {
                        console.log(res.data);

                        this.apartments = res.data.results;
                    })
            },
            async advancedSearch() {
                try {
                    const response = await axios.post('http://localhost:8000/api/advanced-search', {
                        address: this.searchAddress,
                        radius: this.searchRadius,
                        minRooms: this.minRooms,
                        minBeds: this.minBeds
                    });
                    console.log('Risultato ricerca avanzata:', response.data.results);
                    console.log(this.minRooms);
                    console.log(this.minBeds);
                    this.apartments = response.data.results;
                } catch (error) {
                    console.error('Errore durante la ricerca avanzata degli appartamenti:', error);
                }
            },
        },
        created() {
            this.getApartments();
        }
    }
</script>

<template>

    <!-- card con appartamenti sponsorizzate con background verde chiaro -->
    <div class="container">
        
        <div class="row g-0">
            
            <div v-if="showSwiper">
                <ApartmentSponsoredSwiper/>
                <hr>
            </div>
             
            <h1>
                I nostri appartamenti
            </h1>

            <!-- Filtro appartamenti per title -->
            <!-- <div class="mb-2 mt-2 " >
                <div class="col-12 col-lg-6">
                    <div class="">
                        <input v-model="filterTitle" type="text" name="filter" id="filter" class="form-control" placeholder="cerca per nome...">
                    </div>
                </div>
            </div> -->

            <!-- Filtro per indirizzo -->
            <div class="row g-0 justify-content-center mb-2 mt-2">
                <div class="col-6">
                    <input v-model="searchAddress" @input="handleInput" list="suggestions" type="text" class="rounded-2 w-100 border-light-subtle" placeholder="Inserisci un indirizzo...">
                    <datalist id="suggestions">
                        <option v-for="suggestion in suggestions" :value="suggestion">{{ suggestion }}</option>
                    </datalist>
                </div>
                <div class="col-2">
                    <button @click="filterByAddress()" class="w-100">
                        Vai
                    </button>
                </div>
            </div>

            <!-- Filtaggio avanzato -->
            <div v-if="showFilters" class="row justify-content-center g-0">
                <!-- filtro per numero minimo di stanze -->
                <div class="col-4">
                    <label for="numRooms">Scegli il numero di stanze:</label>
                    <select id="numRooms" v-model="minRooms" aria-label="Seleziona il numero minimo di stanze">
                        <option value="">Filtra per stanze...</option>
                        <option v-for="numRooms in roomOptions" :value="numRooms">{{ numRooms }}</option>
                    </select>
                </div>
                <!-- filtro per numero minimo di posti letto -->
                <div class="col-4">
                    <label for="numBeds">Scegli il numero di letti:</label>
                    <select id="numBeds" v-model="minBeds" aria-label="Seleziona il numero minimo di posti letto">
                        <option value="">Filtra per posti letto...</option>
                        <option v-for="numBeds in bedOptions" :value="numBeds">{{ numBeds }}</option>
                    </select>
                </div>
                <div class="col-4">
                    <label for="searchRadius">Seleziona il raggio di ricerca ({{ searchRadius }} km):</label>
                    <input type="range" id="searchRadius" v-model="searchRadius" min="5" max="50" step="5" class="form-range">
                </div>
                <div class="col-6">
                    <button @click="advancedSearch" class="btn btn-primary mt-2 w-100">Cerca</button>
                </div>
            </div>

            <!-- tutti gli appartamenti -->
            <ApartmentCard v-for="singleApartment in apartments" :key="singleApartment.id" :apartment="singleApartment" class="apartment-card"/>

        </div>
    </div>


</template>

<style lang="scss" scoped>
    .apartment-card-sponsored{
        background-color: aquamarine;
    }

    nav {
        ul {
            li {
                button {
                    background-color: white;
                    border: none;
                    padding: 16px;
                    font-weight: bold;
                }

                & .active{
                    border-bottom: 2px solid #5649CD;
                }
            }
        }
    }

   
</style>