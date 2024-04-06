
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
                    <div class="col-12">
                        Servizi: 
                        <span v-for="service in apartment.services" :key="service.id" class="badge rounded-pill text-bg-primary">
                            {{ service.title }}
                        </span>
                    </div>
                    <div class="link-container">
                        <router-link :to="{ name: 'apartments.show', params: { slug: apartment.slug } }">
                            <span>Vai all'appartamento</span>            
                        </router-link>
                    </div>
                </div>
            </div>
        </div>                  
    </div> 
         
        <!-- vecchie card -->
        <!-- <div class="col-3 single-apartment ">

            <h4 class="text-center">
                {{ apartment.title }}
            </h4>

            <div v-for="sponsor in apartment.sponsors" :key="sponsor.id">
                <h5 class="my-3 text-success">
                    Sponsor: {{ sponsor?.title ?? 'NULL' }}
                    
                </h5>
            </div>

            <div class="image_container">
                <img :src="'http://127.0.0.1:8000/storage/' + apartment.cover_img" :alt="apartment.title">
            </div>

            <div class="row">
                <div class="col-12 mt-1">
                    Servizi: 
                    <span v-for="service in apartment.services" :key="service.id" class="badge rounded-pill text-bg-primary">
                        {{ service.title }}
                    </span>
                </div>
            </div>

            <div class="link-container">
                <router-link :to=" { name: 'apartments.show', params: { slug: apartment.slug } } ">
                    <span>Vai all'appartamento</span>            
                </router-link>
            </div>

        </div> -->
    
</template>

<style lang="scss" scoped>
@use '../assets/SCSS/partials/variables.scss' as *;
   

</style>
