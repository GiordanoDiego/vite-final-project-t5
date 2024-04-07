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
                currentPage: 1,
                lastPage: 2,
                filterTitle: '',
                minRooms: '',
                minBeds: '', 
                roomOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9+'],
                bedOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9+'],
                searchRadius: '20', 
                radiusOptions: ['20', '30', '40', '50+'], 
            };
        }, 
        components: {
            ApartmentCard,
            ApartmentSponsored,
            ApartmentSponsoredSwiper,
            RouterView,
        },
        computed: {
            filteredApartments() {
                let filtered = this.apartments;
                if (this.filterTitle.trim()) {
                    filtered = filtered.filter(apartment => apartment.title.toLowerCase().includes(this.filterTitle.toLowerCase()));
                }
                if (this.minRooms) {
                    filtered = filtered.filter(apartment => apartment.n_rooms >= parseInt(this.minRooms));
                }
                if (this.minBeds) {
                    filtered = filtered.filter(apartment => apartment.n_beds >= parseInt(this.minBeds));
                }
                return filtered;
            },
            sponsoredApartments() {
                return this.apartments.filter(apartment => apartment.sponsors.length > 0);
                }
             },
        methods: {
            async filterByAddress() {
                try {
                    const { lat, lon } = await this.getCoordinatesFromAddress(this.searchAddress);
                    const filteredApartments = this.apartments.filter(apartment => {
                        const distance = this.calculateDistance(lat, lon, apartment.lat, apartment.lon);
                        return distance <= parseInt(this.searchRadius); // Utilizza il raggio selezionato
                    });
                    this.apartments = filteredApartments;
                } catch (error) {
                    console.error('Errore durante il filtro degli appartamenti:', error);
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
            
            getApartments(page) {
                axios.get('http://127.0.0.1:8000/api/apartments/', {
                        params: {
                            page
                        }
                    })
                    .then(res => {
                        console.log(res.data);

                        this.apartments = res.data.results.data;
                        this.currentPage = res.data.results.current_page;
                        this.lastPage = res.data.results.last_page;
                    })
            },
            nextPage() {
                if (this.currentPage < this.lastPage) {

                    this.currentPage++;

                    console.log('currentPage: ', this.currentPage);

                    this.getApartments(this.currentPage);
                }
            },
            prevPage() {
                if (this.currentPage > 1) {
                     this.goToPage(--this.currentPage);
                }
            },
            goToPage(pageNumber) {
                this.getApartments(pageNumber);
            }
        },
        created() {
            // this.goToPage(this.currentPage);
            this.getApartments(this.currentPage);
        }
    }
</script>

<template>

    <!-- card con appartamenti sponsorizzate con background verde chiaro -->
    <div class="container">
        
        <div class="row g-0">
            
            <ApartmentSponsoredSwiper/>
            <hr>
             
            <h1>
                Tutti appartamenti
            </h1>
             <!-- Filtro appartamenti per title -->
            <div class="mb-2 mt-2 " >
                <div class="col-12 col-lg-6">
                    <div class="">
                        <input v-model="filterTitle" type="text" name="filter" id="filter" class="form-control" placeholder="cerca per nome...">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-2">
                    <!-- filtro per numero minimo di stanze -->
                    <select v-model="minRooms" class="form-select" aria-label="Seleziona il numero minimo di stanze">
                        <option value="">Filtra per stanze...</option>
                        <option v-for="numRooms in roomOptions" :value="numRooms">{{ numRooms }}</option>
                    </select>
                </div>
                <div class="col-2">
                    <!-- filtro per numero minimo di posti letto -->
                    <select v-model="minBeds" class="form-select" aria-label="Seleziona il numero minimo di posti letto">
                        <option value="">Filtra per posti letto...</option>
                        <option v-for="numBeds in bedOptions" :value="numBeds">{{ numBeds }}</option>
                    </select>
                </div>
            </div>
            
            <!-- Filtro per indirizzo raggio 20km-->
            <div class="mb-2 mt-2">
                <div class="col-4 col-lg-6">
                    <input v-model="searchAddress" type="text" class="form-control" placeholder="Inserisci l'indirizzo...">
                </div>
                <div class="col-4 col-lg-4 mt-2">
                    <select v-model="searchRadius" class="form-select" aria-label="Seleziona il raggio di ricerca">
                        <option v-for="radius in radiusOptions" :value="radius">{{ radius }} km</option>
                    </select>
                </div>
                <div class="col-12 col-lg-2 mt-2">
                    <button @click="filterByAddress" class="btn btn-primary">Cerca</button>
                </div>
            </div>
            <!-- tutti gli appartamenti -->
            <ApartmentCard v-for="singleApartment in filteredApartments" :key="singleApartment.id" :apartment="singleApartment" class="apartment-card"/>


            <nav class="d-flex justify-content-center mt-3">
                <ul class="my-pagination list-unstyled d-flex">
                    <li class="my-page-item me-3">
                        <button class="my-page-link" @click="prevPage()" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>
                    <li class="my-page-item">
                        <button v-for="pageNumber in lastPage" @click="goToPage(pageNumber)" class="my-page-link d-inline-block"
                        :class="(pageNumber == currentPage) ? 'active' : ''">
                            <span aria-hidden="true">{{ pageNumber }}</span>
                        </button>
                    </li>
                    <li class="my-page-item ms-3">
                        <button class="my-page-link" @click="nextPage()" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>
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