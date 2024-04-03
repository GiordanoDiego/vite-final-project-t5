
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

        <div class="col-3 single-apartment ">

            <h4 class="text-center">
                {{ apartment.title }}
            </h4>

            <div v-for="sponsor in apartment.sponsors" :key="sponsor.id">
                <h5 class="my-3 text-success">
                    Sponsor: {{ sponsor?.title ?? 'NULL' }}
                    <!-- Sponsor: {{ sponsor ? sponsor.title : 'NULL' }} -->
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

        </div>
    
</template>

<style lang="scss" scoped>
@use '../assets/SCSS/partials/variables.scss' as *;
    .single-apartment {
        border: 2px solid black;
        border-radius: 5px;
        padding: 15px;
        margin: 20px auto;
        height: 400px;
        position: relative;

        h4{
            color: $primary-text-color;
        }
        .image_container{
            height: 150px;
            img {
                width: 100%;
                height: 100%;
            }
        }

        .link-container {
            //margin-top: 12px;
            position: absolute;
            bottom: 5px;
            
            span {
                display: inline-block;
                background-color: #0288A9;
                color: white;
                padding: 4px 8px;
                cursor: pointer;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }

</style>
