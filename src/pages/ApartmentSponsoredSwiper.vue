<!-- QUESTO COMPONENTE HA LO SLIDER CON TUTTI GLI APPARTAMENTI SPONSORIZZATI -->
<script>
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';

export default {
  data() {
    return {
      apartments: [],
    };
  },
  components: {
    Swiper,
    SwiperSlide
  },
  methods: {
    getSponsoredApartments() {
      axios
        .get('http://127.0.0.1:8000/api/get-sponsored-apartments')
        .then(res => {
          this.apartments = res.data.results;
        })
        .catch(error => {
          console.error('Error fetching sponsored apartments:', error);
        });
    },
  },
  created() {
    this.getSponsoredApartments();
  }
};
</script>

<template>
    <h1>
        Lasciati ispirare
    </h1>
    <div class="my_bg">
    <swiper
        :slides-per-view="1"
        :space-between="30"
        class="mySwiper"
        :observer="true"
        :pagination="{ clickable: true }"
        :breakpoints = "{
            576: {
              slidesPerView: 2,
              spaceBetween: 30
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            998: {
              slidesPerView: 4,
              spaceBetween: 30
            }
        }"
    >
    <!-- card su swiper -->
        <swiper-slide v-for="apartment in apartments" :key="apartment.id" class="personalize">
        
            <div class="card h-100">
                <router-link
                    :to="{ name: 'apartments.show', params: { slug: apartment.slug } }" class="btn p-0 router_link_class">
                    <div class="img_container">
                        <div v-if="apartment.latestSponsorship" class="latest-sponsorship rounded-pill">
                            Amato dagli ospiti
                        </div>
                        <img
                            :src="'http://127.0.0.1:8000/storage/' + apartment.cover_img"
                            :alt="apartment.title"
                            class="card-img-top img-fluid"
                            style="height: 200px; object-fit: cover;"
                        />
                    </div>
                    <div class="card-body text-start">
                        <div class="card-text row">
                            <div class="col-12">
                                <strong>
                                    {{ apartment.title }}
                                </strong>
                            </div>
                            <div class="col-12 address_container">
                                {{ apartment.address }}
                            </div>
                            <div class="mt-2 mb-2 carateristic">
                                <span>
                                    {{ apartment.n_rooms }} 
                                    <abbr title="camere">
                                        <i class="fa-solid fa-person-shelter"></i>
                                    </abbr>
                                    - 
                                </span> 
                                <span>
                                    {{ apartment.n_beds }}
                                    <abbr title="letti">
                                        <i class="fa-solid fa-bed px-1"></i>
                                    </abbr>
                                    - 
                                </span> 
                                <span> 
                                    {{ apartment.n_baths }}  
                                    <abbr title="bagni">
                                        <i class="fa-solid fa-bath px-1 "></i>
                                    </abbr>
                                    - 
                                </span>
                                <span>
                                    {{ apartment.mq }} mq
                                </span>  
                            </div>
                            <div>
                                <strong>
                                    {{ apartment.price }} €
                                </strong>
                                <span>
                                    / Notte
                                </span>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </swiper-slide>
    </swiper>
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/SCSS/partials/variables.scss' as *;


.my_bg{
    padding-top: 20px;
    padding-bottom: 20px;
}
.swiper {
    width: 100%;
    height: 100%;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FAFAFA;

}

.swiper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
  grid-gap: 20px; 
}

.swiper-slide {
  display: flex;
  flex-direction: column;
}

.card {
  flex: 1;
}
.swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card {

    background-color: #FFFFFF;
    transition: all 0.5s;
    overflow: hidden;
    border: none;
    border-radius: 20px;
    .carateristic {
        font-size: smaller;
        color: gray;
    }
    // img{
    //     border-radius: 20px;
    // }
    .btn:first-child:active, .btn.active, .btn.show {
        color: var(--bs-btn-active-color);
        background-color: var(--bs-btn-active-bg);
        border-color: white;
    }
 
    .img_container {
        position: relative;
        overflow: hidden;
        .latest-sponsorship {
            position: absolute;
            top: 10px;
            background-color: white;
            border-radius: 5px;
            padding: 2px 4px;
            left: 10px;
            font-size: 12px; /* Modifica la dimensione del testo secondo le tue preferenze */
            z-index: 999;
        }
        img{
            // border-radius: 20px;
            height: 200px;
            object-fit: cover;

            transition: transform 0.5s;
        }


    }

    &:hover{
        cursor: pointer;
        background-color: white;
        // box-shadow: 0px 0px 10px 3px #252525;
        transform: scale(1.03);

        .latest-sponsorship {
            transition: transform 0.5s;
            transform: scaleX(1.05) scaleY(1.05);
        }

        img {
            transition: transform 0.5s;
            transform: scale(1.1);
        }
    }

    .show_single_apartment_button{
        background-color: $button_background_color;
        color: white;
        padding: 2px 5px;
        margin-top: 8px;
        display: flex;
        justify-content: center;
    }

    .address_container{
        font-size: 0.8em;
    }
    .single_service {
        position: relative;
        margin-right: 3px;
        color: white;
        background-color: $button_background_color;
    }

    .tooltip-text {
        visibility: hidden;
        background-color: $button_background_color;
        color: white;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        position: absolute;
        z-index: 1;
        bottom: 100%;

        transform: translateX(-20%);
    }

    .single_service:hover .tooltip-text {
        visibility: visible;
    }
}
</style>
