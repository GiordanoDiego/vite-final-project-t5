<script >
import axios from 'axios';
import ApartmentCard from './ApartmentCard.vue';
import ApartmentSponsored from './ApartmentSponsored.vue';
import ApartmentSponsoredSwiper from './ApartmentSponsoredSwiper.vue';
import { RouterView } from 'vue-router';


    export default {
        data() {
            return {
                // Definisco un array vuoto dove andrò ad inserire gli Appartamenti
                apartments: [],
                // Definisco una variabile che utilizzerò per filtrare per nome dell'appartamento
                filterTitle: '',
                // Definisco una variabile che utilizzerò per filtrare per indirizzo
                searchAddress: '',
                // Definisco un array vuoto per i suggerimenti degli indirizzi
                suggestions: [],
                // Definisco una variabile per il numero di stanze 
                minRooms: '',
                // Definisco una variabile per il numero dei letti
                minBeds: '', 
                // Definisco le opzioni per il numero di stanze da filtrare
                roomOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                // Definisco le opzioni per il numero di letti da filtrare
                bedOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                // Definisco una variabile per la scelta del numero di stanze
                selectedRoom: null,
                // Definisco una variabile per la scelta del numero di letti
                selectedBed: null,
                // Definisco il raggio di default il filtraggio egli appartamenti
                searchRadius: '20', 
                // Definisco le opzioni per il filtraggio per km
                radiusOptions: ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50'], 
                // Creo una flag per la visibilità dello swiper
                showSwiper: true,
                // Creo una flag per la visibilità dei filtri
                showFilters: false,
                // Definisco un array vuoto che verrà popolato con i servizi disponibili
                services:[],
                // Definisco un array vuoto che verrà popolato con i servizi sscelti dall'utente
                selectedServices: [],
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
                return this.apartments.filter(apartment => apartment.sponsors.length > 0);
                }
             },
        methods: {
            // Creo una funzione che filtri i risultati in base all'indirizzo scelta dall'utente
            async filterByAddress() {
                if  (this.searchAddress == '') {
                    location.reload()
                } else {
                    try {
                        // Definisco le variabili di lat e lon che recupererò dall'indirizzo inserito
                        const { lat, lon } = await this.getCoordinatesFromAddress(this.searchAddress);
                        // Definisco gli appartamenti filtrati 
                        const filteredApartments = this.apartments.filter(apartment => {
                            const distance = this.calculateDistance(lat, lon, apartment.lat, apartment.lon);
                            // Filtra solo gli appartamenti entro 20 km dall'indirizzo scelto
                            return distance <= 20; 
                        });
                        // Assegno il risultato del filtraggio agli appartamenti
                        this.apartments = filteredApartments;
                        // Cambia il valore della flag per lo swiper
                        this.showSwiper = false;
                        // Cambia il valore della flag per i filtri
                        this.showFilters = true;
                    } catch (error) {
                        console.error('Errore durante il filtro degli appartamenti:', error);
                    }
                }
            },
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
                if (this.searchAddress.trim() !== '') {
                    this.getSuggestionsFromAddress(this.searchAddress);
                } else {
                    this.suggestions = [];
                }
            },
            // Definico una funzione per ottenere le coordinate dall'indirizzo utilizzando l'API di TomTom
            async getCoordinatesFromAddress(address) {
                const apiKey = 'x5vTIPGVXKGawffLrAoysmnVC9V0S8cq';
                const response = await axios.get(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${apiKey}`);
                const { lat, lon } = response.data.results[0].position;
                return { lat, lon };
            },
            // Definisco una funzione per calcolare la distanza in km tra due coppie di coordinate
            calculateDistance(lat1, lon1, lat2, lon2) {
                // Raggio medio della Terra in chilometri
                const R = 6371;
                const dLat = this.degreesToRadians(lat2 - lat1);
                const dLon = this.degreesToRadians(lon2 - lon1);
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                // Distanza in chilometri
                const distance = R * c; 
                return distance;
             },
            // Definisco una funzione per convertire un angolo in un radiante
            degreesToRadians(degrees) {
                return degrees * (Math.PI / 180);
            },
            // Definisco una funzione per recuperare tutti gli appartamenti dal DB
            getApartments() {
                axios.get('http://127.0.0.1:8000/api/apartments/')
                    .then(res => {
                        console.log(res.data);

                        this.apartments = res.data.results;
                    })
            },
            // Definisco una funzione per il filtraggio avanzato tra gli appartamenti 
            async advancedSearch() {
                try {
                    const response = await axios.post('http://localhost:8000/api/advanced-search', {
                        // Utilizzo i parametri
                        address: this.searchAddress,
                        radius: this.searchRadius,
                        minRooms: this.selectedRoom,
                        minBeds: this.selectedBed,
                        services: this.selectedServices,
                        filterTitle: this.filterTitle
                    });
                    // Assegno i risultati del filtraggio agli appartamenti
                    console.log(this.filterTitle);
                    this.apartments = response.data.results;
                } catch (error) {
                    console.error('Errore durante la ricerca avanzata degli appartamenti:', error);
                }
            },
            // Definisco una funzione per recuperare i servizi
            getServices() {
                axios.get('http://127.0.0.1:8000/api/services')
                    .then(res => {
                        // Assegno il risultato della chiamata all'array dei servizi
                        this.services = res.data.results;
                    });
            },
            // Definisco una funzione per selezionare i servizi tramite le checkbox
            toggleService(service) {
                if (this.selectedServices.includes(service)) {
                    // Se il servizio è già presente, viene rimosso dall'array
                    this.selectedServices = this.selectedServices.filter(s => s !== service);
                } else {
                    // Altrimenti viene pushato
                    this.selectedServices.push(service);
                }
            },
            handleRoomSelection(selectedOption) {
                if (this.selectedRoom === selectedOption) {
                    // Se l'opzione selezionata è già quella attualmente selezionata, deselezionala
                    this.selectedRoom = null;
                } else {
                    // Altrimenti, imposta l'opzione selezionata e deseleziona le altre
                    this.selectedRoom = selectedOption;
                }
            },
            handleBedSelection(selectedOption) {
                if (this.selectedBed === selectedOption) {
                    // Se l'opzione selezionata è già quella attualmente selezionata, deselezionala
                    this.selectedBed = null;
                } else {
                    // Altrimenti, imposta l'opzione selezionata e deseleziona le altre
                    this.selectedBed = selectedOption;
                }
            },
            resetForm() {
                this.searchRadius = '';
                this.selectedBed = null; 
                this.selectedRoom = null;
                this.selectedServices = [];
            },
        },
        created() {
            // Alla creazione della pagina richiamo tutti gli appartamenti
            this.getApartments();
            // Alla creazione della pagina richiamo tutti i servizi
            this.getServices();
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
             
            <!-- Filtro per indirizzo -->
            <div class="row g-0 justify-content-center align-items-center mb-2 mt-2">
                <div class="col-4 my-container">
                    <input v-model="searchAddress" @input="handleInput" list="suggestions" type="text" class="w-100 border-light-subtle border-0" placeholder="Inserisci un indirizzo...">
                    <datalist id="suggestions">
                        <option v-for="suggestion in suggestions" :value="suggestion">{{ suggestion }}</option>
                    </datalist>
                </div>
                <div class="col-1 my-container">
                    <button @click="filterByAddress()" class="w-100 border-0 go-button">
                        Vai
                    </button>
                </div>
                <div class="col-auto ps-2">
                    <button v-if="showFilters" type="button" class="filter-button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i class="fa-solid fa-sliders"></i>
                    </button>
                </div>
            </div>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header text-center">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Filtri</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Filtaggio avanzato -->
                            <div class="advanced-search-container my-2">
                                <div class="row justify-content-center g-0 my-2">
                                    <div class="col-12 ">
                                        <!-- Filtro appartamenti per title -->
                                        <div class="row g-0 justify-content-center">
                                            <div class="col-12 col-lg-6">
                                                <div>
                                                    <input v-model="filterTitle" type="text" name="filter" id="filter" class="form-control" placeholder="cerca per nome...">
                                                </div>
                                            </div>
                                        </div>
                                        <!-- filtro per numero minimo di stanze -->
                                        <div class="row g-0 justify-content-center">
                                            <h5 class="mt-2">
                                                Stanze e letti
                                            </h5>
                                            <!-- Filtro per il numero di stanze -->
                                            <div class="col-12">
                                                <p class="text-light-emphasis">Camere da letto</p>
                                                <div class="row g-0 flex-nowrap overflow-auto justify-content-between">
                                                    <div v-for="(option, index) in roomOptions" :key="index" class="col-auto mx-1">
                                                        <input class="filter-checkbox" type="checkbox" :value="option" :id="'numRooms_' + index" v-model="selectedRoom" @change="handleRoomSelection(option)">
                                                        <label :for="'numRooms_' + index" :class="{ 'checked': selectedRoom === option }">{{ option }}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Filtro per il numero di letti -->
                                            <div class="col-12 mt-2">
                                                <p class="text-light-emphasis">Numero Letti</p>
                                                <div class="row g-0 flex-nowrap overflow-auto justify-content-between">
                                                    <div v-for="(option, index) in bedOptions" :key="index" class="col-auto mx-1">
                                                        <input class="filter-checkbox" type="checkbox" :value="option" :id="'numBeds_' + index" v-model="selectedBed" @change="handleBedSelection(option)">
                                                        <label :for="'numBeds_' + index" :class="{ 'checked': selectedBed === option }">{{ option }}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Filtro per il raggio di km -->
                                            <div class="col-10 col-sm-6 mt-2">
                                                <label for="searchRadius">Nelle vicinanze ({{ searchRadius }} km):</label>
                                                <input type="range" id="searchRadius" v-model="searchRadius" min="5" max="50" step="5" class="form-range">
                                            </div>
                                            <!-- Filtro per i servizi -->
                                            <div class="col-12 mt-2">
                                                <div class="row justify-content-around">
                                                    <div v-for="(singleService, index) in services" :key="index" class="col-sm-6 col-3">
                                                        <input v-model="selectedServices" :value="singleService" class="form-check-input" type="checkbox" :id="'service_' + index">
                                                        <label :for="'service_' + index">
                                                                <i :class="singleService.icon" class="ps-1 px-sm-1"></i>
                                                                <span class="d-none d-sm-inline-block">  
                                                                    {{ singleService.title }} 
                                                                </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer justify-content-center align-items-center">
                            <div class="col-4 col-sm-2">
                                <button @click="resetForm()" type="button" class="w-100 clear-button border-0">Pulisci</button>
                            </div>
                            <div class="col-4 col-sm-2">
                                <button type="button" @click="advancedSearch" class="my-button w-100 border-0" data-bs-dismiss="modal">Cerca</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- tutti gli appartamenti -->
            <ApartmentCard v-for="singleApartment in apartments" :key="singleApartment.id" :apartment="singleApartment" class="apartment-card"/>

        </div>
    </div>


</template>

<style lang="scss" scoped>
    @import '../assets/SCSS/partials/variables.scss';
    .apartment-card-sponsored{
        background-color: aquamarine;
    }

    .my-container {
        border: 0.5px solid;
        border-color: black;
        border-radius: 5px;

        input, button {
            padding: 4px;
        }

        input {
            border-bottom-left-radius: 5px;
            border-top-left-radius: 5px;
        }
        .go-button {
            background-color: $button_background_color;
            border-bottom-right-radius: 5px;
            border-top-right-radius: 5px;
            color: white;
        }
    }

    .filter-button {
        background-color: #cbcbcb;
        border: 0;
        border-radius: 5px;
        color: white;
        padding: 4px 8px;
    }

    .my-container:hover, .filter-button:hover {
        box-shadow: 0px 0px 5px 1px #000000;
    }

    .advanced-search-container {
        box-shadow: 0px 0px 5px 1px #000000;
        padding: 16px;

        .form-range {
            color: $form-range-thumb-bg;
        }

        .filter-checkbox {
            display: none;
        }

        .filter-checkbox + label {
            display: block;
            line-height: normal;
            cursor: pointer;
            padding: 4px 20px;
            border: 1px solid black;
            border-radius: 15px;
            text-align: center;
        }

        .filter-checkbox + label:hover {
            background-color: $secondary_text_color;
            color: white;
        }

        label.checked {
            color: white;
            background-color: $primary_text_color;
        }

    }

    .modal-footer {

        .clear-button, .my-button {
            border-radius: 5px;
            padding: 6px 12px;
            color: white;
        }
        .my-button {
            background-color: $button_background_color;
        }

        .clear-button {
            background-color: #cbcbcb;
        }
        .clear-button:hover, .my-button:hover {
        box-shadow: 0px 0px 5px 1px #000000;
        }
    }
</style>