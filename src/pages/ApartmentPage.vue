<script >
import axios from 'axios';
import ApartmentCard from './ApartmentCard.vue';
import { RouterView } from 'vue-router';

    export default {
        data() {
            return {
                // Definisco un array vuoto dove inserirò i risultati dell'API
                apartments: [],
                // Dichiaro il valore della pagina corrente
                currentPage: 1,
                // Dichiaro il valore dell'ultima pagina
                lastPage: 2,
            };
        },
        components: {
            ApartmentCard,
            RouterView
        },
        methods: {
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

    <h1 class="text-center my-3">
        Tutti gli Appartamenti
    </h1>

    <div class="row g-0">
        
        <ApartmentCard v-for="singleApartment in apartments" :key="singleApartment.id" :apartment="singleApartment" class="apartment-card"/>

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


</template>

<style lang="scss" scoped>

    .apartment-card {
        width: calc((100% / 4) - 40px);
        margin: 20px;
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