<script >
import axios from 'axios';
import ApartmentCard from './ApartmentCard.vue';
import ApartmentSponsored from './ApartmentSponsored.vue';
import { RouterView } from 'vue-router';
import { store } from '../store';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';


    export default {
        data() {
            return {
                store,
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
                // Definisco un array vuoto che verrà popolato con i servizi sscelti dall'utente
                selectedServices: [],
            };
        }, 
        components: {
            ApartmentCard,
            ApartmentSponsored,
            RouterView,
        },
        computed: {
            // Definisco una funzione per gli appartamenti sponsorizzati
            sponsoredApartments() {
                return this.store.apartments.filter(apartment => apartment.sponsors.length > 0);
                },
                filtersActive() {
                return (
                    this.selectedRoom !== null ||
                    this.selectedBed !== null ||
                    this.searchRadius !== '20' ||
                    this.selectedServices.length > 0
                );
            },
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
            // Definisco una funzione per il filtraggio avanzato tra gli appartamenti 
            async advancedSearch() {
                try {
                    const response = await axios.post('http://localhost:8000/api/advanced-search', {
                        // Utilizzo i parametri
                        address: this.store.searchAddress,
                        radius: this.searchRadius,
                        minRooms: this.selectedRoom,
                        minBeds: this.selectedBed,
                        services: this.selectedServices,
                        filterTitle: this.filterTitle
                    });

                    console.log(response);
                    // Assegno i risultati del filtraggio agli appartamenti
                    console.log(this.filterTitle);
                    this.store.apartments = response.data.results;
                    this.store.distance = true;

                    // Memorizza le coordinate di ogni appartamento
                    this.store.apartments = response.data.results.map(apartment => ({
                    ...apartment,
                    lat: apartment.lat || 0, // Imposta la latitudine a 0 se non è valida
                    lon: apartment.lon || 0, // Imposta la longitudine a 0 se non è valida
                    coverImgUrl: `http://127.0.0.1:8000/storage/${apartment.cover_img}`
                    }));

                    console.log(this.store.apartments);

                    setTimeout(() => {
                        // Verifica che ci siano almeno un paio di appartamenti con coordinate valide
                        this.initTomTomMap();
                    }, 500);

                } catch (error) {
                    console.error('Errore durante la ricerca avanzata degli appartamenti:', error);
                }
            },
            // Definisco una funzione per recuperare i servizi
            getServices() {
                axios.get('http://127.0.0.1:8000/api/services')
                    .then(res => {
                        // Assegno il risultato della chiamata all'array dei servizi
                        this.store.services = res.data.results;
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
                this.searchRadius = 20;
                this.selectedBed = 1; 
                this.selectedRoom = 1;
                this.selectedServices = [];
                this.filterTitle = '';
            },
            initTomTomMap() {
                const map = tt.map({
                    key: 'x5vTIPGVXKGawffLrAoysmnVC9V0S8cq',
                    container: 'mapId',
                    center: [this.store.apartments[0].lon, this.store.apartments[0].lat], // Inverti l'ordine di lon e lat
                    zoom: 10,
                });

                // Definisci gli offset del popup personalizzato
                const popupOffsets = {
                    'top': [0, 0],
                    'top-left': [0, 0],
                    'top-right': [0, 0],
                    'bottom': [0, -50],
                    'bottom-left': [25, -50],
                    'bottom-right': [-25, -50],
                    'left': [25, -25],
                    'right': [-25, -25]
                };              

                // Aggiungi un marker al centro della mappa
                    this.store.apartments.forEach(apartment => {

                        const popup = new tt.Popup({ offset: popupOffsets});

                        const marker = new tt.Marker()
                            .setLngLat([apartment.lon, apartment.lat])
                            .setPopup(popup)
                            .addTo(map);


                        popup.setLngLat([apartment.lon, apartment.lat])
                            .setHTML(`
                                <h3>${apartment.title}</h3>
                                <img src="${apartment.coverImgUrl}" alt="${apartment.title}" style="width: 100%; height:100px">
                                <p>${apartment.address}</p>
                                <p>${apartment.n_rooms} camere, ${apartment.n_beds} letti</p>
                                <p>Prezzo: €${apartment.price} / notte</p>
                            `);

                        // Aggiungi l'evento click al marker per aprire il popup
                        marker.on('click', () => {
                            // Apri il popup del marker cliccato
                            map.addTo(map);
                        }); 
                    });

                    console.log('Queste sono le coordinate: ',this.store.apartments[0].lon, this.store.apartments[0].lat);
            }
        },
        created() {
            // Alla creazione della pagina richiamo tutti i servizi
            this.getServices();
            // Alla creazione
            this.advancedSearch();
        }
    }
</script>

<template>
    <!-- card con appartamenti sponsorizzate con background verde chiaro -->
    <div class="container">
        <div class="row g-0">
            <div class="col-12">

                <!-- Mappa -->
                <div v-if="store.apartments !== undefined" class="col-sm-12 my-3">
                    <div id="mapId" style="height: 400px; width: 100%; border-radius: 25px;"></div>
                </div>


                <!-- Filtro per indirizzo -->
                <div class="row g-0 justify-content-center align-items-center mb-2 mt-2">
                    <div class="col-12 col-sm-8 col-md-6 my-container">
                        <span class="input-with-button">
                            <input v-model="store.searchAddress" @input="handleInput" list="suggestions" type="text" class="w-100 border-0 ps-3" placeholder="Inserisci un indirizzo...">
                            <button @click="advancedSearch()" class="go-button">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </button>
                            <ul v-if="suggestions.length > 0" class="list-group search-suggestions border-0">
                                <li v-for="suggestion in suggestions" :key="suggestion" class="list-group-item fw-medium" @click="selectAddress(suggestion)">{{ suggestion }}</li>
                            </ul>
                        </span>
                    </div>
                    <div class="col-auto ps-2">
                        <button type="button" class="filter-button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <i class="fa-solid fa-sliders"></i>
                        </button>
                    </div>
                </div>
                <!-- Modale per filtraggio avanzato -->
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header border-0 text-center">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">
                                    Filtri
                                </h1>
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
                                                    <div class="row g-0 flex-nowrap overflow-auto justify-content-between filter-container">
                                                        <div v-for="(option, index) in roomOptions" :key="index" class="col-auto mx-1">
                                                            <input class="filter-checkbox" type="checkbox" :value="option" :id="'numRooms_' + index" v-model="selectedRoom" @change="handleRoomSelection(option)">
                                                            <label :for="'numRooms_' + index" :class="{ 'checked': selectedRoom === option }">{{ option }}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- Filtro per il numero di letti -->
                                                <div class="col-12 mt-2">
                                                    <p class="text-light-emphasis">Numero Letti</p>
                                                    <div class="row g-0 flex-nowrap overflow-auto justify-content-between filter-container">
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
                                                        <div v-for="(singleService, index) in store.services" :key="index" class="col-sm-6 col-3">
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
                            <div class="modal-footer border-0 justify-content-center align-items-center">
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

                <!-- filtri attivi -->
                <div class="row g-0 justify-content-center mb-2 mt-2" v-if="filtersActive">
                    <div class="col-auto me-2 ">
                        <h5>Filtri Attivi:</h5>
                    </div>
                    <!-- numero di stanze selezionato -->
                    <div class="col-auto me-1" v-if="selectedRoom !== null">
                        <span class="badge bg-secondary">{{ selectedRoom }} stanze</span>
                    </div>
                    <!-- numero di letti selezionato -->
                    <div class="col-auto me-1" v-if="selectedBed !== null">
                        <span class="badge bg-secondary">{{ selectedBed }} letti</span>
                    </div>
                    <!-- raggio di ricerca selezionato -->
                    <div class="col-auto me-1" v-if="searchRadius !== '20'">
                        <span class="badge bg-secondary">Raggio: {{ searchRadius }} km</span>
                    </div>
                    <!-- servizi selezionati -->
                    <div class="col-auto" v-if="selectedServices.length > 0">
                        <span class="badge bg-secondary me-1 " v-for="service in selectedServices" :key="service.id">{{ service.title }}</span>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="row">
                    <div v-if="store.apartments === undefined" class="col-12 mt-5">
                        <h2 class="text-center">
                            Oops.. non abbiamo trovato appartamenti per questo indirizzo!
                        </h2>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <img src="/img/not-found.png" alt="Nessun appartamento trovato">
                            </div>
                        </div>
                    </div>
                    
                    <div v-else  class="col-12 d-flex flex-wrap">
                        <!-- tutti gli appartamenti -->
                        <ApartmentCard v-for="singleApartment in store.apartments" :key="singleApartment.id" :apartment="singleApartment"/>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<style lang="scss" scoped>
    @import '../assets/SCSS/partials/variables.scss';
    .my-container {
        cursor: pointer;
        // border: 0.5px solid rgba(0, 0, 0, 0.521);
        border-radius: 50px;
        .input-with-button {
            display: flex;
            align-items: center;
            position: relative;

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
                transition: transform 0.5s;

                &:hover {
                    transform: scale(1.1);
                }
            }

            .search-suggestions {
                position: absolute;
                background-color: #ffffff;
                border-bottom-left-radius: 25px;
                border-bottom-right-radius: 25px;
                border: 0.5px solid rgba(0, 0, 0, 0.521);
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
                top: 100%;
                width: 100%;
                }
                .search-suggestions::-webkit-scrollbar {
                    display: none;
                }

                .search-suggestions li {
                padding: 5px;
                cursor: pointer;
                }

                .search-suggestions li:hover {
                background-color: #f0f0f0;
            }

        }

    }

    .filter-button {
        background-color: #cbcbcb;
        // border: 0.5px solid rgba(0, 0, 0, 0.521);
        border:none;
        border-radius: 50px;
        color: white;
        padding: 4px 8px;
        transition: transform 0.5s;

        &:hover {
                    transform: scale(1.1);
        }
    }

    .go-button:hover, .filter-button:hover, .my-container:hover{
        // box-shadow: 0px 0px 5px 1px #000000;
    }

    .modal {
        box-shadow: 0px 0px 5px 1px #000000;
    }
    .advanced-search-container {
        
        padding: 16px;

        .form-range {
            color: $form-range-thumb-bg;
        }

        .filter-checkbox {
            display: none;
        }

        .filter-container::-webkit-scrollbar {
            background-color: transparent;
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
            transition: transform 0.5s;
            transform: scale(1.1);
        }
    }

    img {
        width: 100%;
    }
</style>
