<script >
import axios from 'axios';
    export default {
        data() {
            return {
                apartment: null
            };
        },
        methods: {
            
            getApartment() {
                axios.get('http://127.0.0.1:8000/api/apartments/' + this.$route.params.slug)
                    .then(res => {
                        console.log(res.data);

                        // Se la chiamata ha buon fine
                        if (res.data.success) {
                            // Si vedrà il singolo appartamento
                            this.apartment = res.data.results;
                        } else {
                            // Altrimenti restituiamo la pagina d'errore
                            this.$router.push({ name: 'not-found' });
                        }
                    })

            },

        },
        created() {
            this.getApartment();
        }
    }
</script>

<template>

        <div v-if="apartment != null" class="col-3 single-apartment">

            <h2 class="text-center text-primary">
                {{ apartment.title }}
            </h2>

            <div v-for="sponsor in apartment.sponsors" :key="sponsor.id">
                <h5 class="my-3 text-success">
                    Sponsor: {{ sponsor?.title ?? 'NULL' }}
                    <!-- Sponsor: {{ sponsor ? sponsor.title : 'NULL' }} -->
                </h5>
            </div>

            <div v-if="apartment.cover_img != null">
                <img :src="apartment.full_cover_img" :alt="apartment.title">
            </div>

            <div class="row">
                <div class="col-12">
                    Servizi: 
                    <span v-for="service in apartment.services" :key="service.id" class="badge rounded-pill text-bg-primary">
                        {{ service.title }}
                    </span>
                </div>
            </div>
        </div>
    
</template>

<style lang="scss" scoped>
    .single-apartment {
        border: 2px solid black;
        border-radius: 5px;
        padding: 15px;
        margin: 20px auto;
        height: 400px;

        img {
            width: 100%;
        }
    }

</style>