
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

        <div class="col-3 single-apartment">

            <h2 class="text-center text-primary">
                {{ apartment.title }}
            </h2>

            <h5 class="my-3 text-success">
                Sponsor: {{ apartment.service?.title ?? 'NULL' }}
                <!-- Sponsor: {{ apartment.service ? apartment.service.title : 'NULL' }} -->
            </h5>

            <div v-if="apartment.cover_img != null">
                <img :src="apartment.full_cover_img" :alt="apartment.title">
            </div>

            <div class="row">
                <div class="col-12">
                    Sponsor: 
                    <span v-for="sponsor in apartment.sponsor" :key="sponsor.id" class="badge rounded-pill text-bg-primary">
                        {{ sponsor.title }}
                    </span>
                </div>
            </div>

            <!-- <div class="link-container">
                <router-link :to=" { name: 'apartments.show', params: { slug: apartment.slug } } ">
                    <span>Vai al progetto</span>            
                </router-link>
            </div> -->

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

        .link-container {
            margin-top: 12px;

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
