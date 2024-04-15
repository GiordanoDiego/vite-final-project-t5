<script >
import axios from 'axios';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

    export default {
        data() 
        {
            
            return {
                apartment: null,
                name: '',
                email: '',
                message: '',
                accepted: false,
                alert: false,
                messageSent: false,
                apartmentId: null,
                showError: false,
                
            };
        },
        created(){
        this.getApartment();
    },
    mounted() {
    //this.loadTomTomMapsScript();
    //this.initTomTomMap();
    this.getViews();
  },
        methods: {
            getApartment() {
            axios.get('http://127.0.0.1:8000/api/apartments/' + this.$route.params.slug)
                .then(res => {
                    console.log(res.data);

                    // Se la chiamata ha buon fine
                    if (res.data.success == true) {
                        // Si vedrà il singolo appartamento
                        this.apartment = res.data.results;
                        console.log(this.apartment);
                        // Assegna l'ID dell'appartamento
                        this.apartmentId = this.apartment.id; 
                        
                        // Inizializza la mappa con le coordinate dell'appartamento
                        this.initTomTomMap(this.apartment.lat, this.apartment.lon);

                    } else {
                        // Altrimenti restituiamo la pagina d'errore
                        this.$router.push({ name: 'not-found' });
                    }
                })
        },
            sendMessage() {
                    if (this.name != null
                        && 
                        this.name != ''
                        &&
                        this.name.length <= 64
                        &&    
                        this.email != null
                        && 
                        this.email != ''
                        &&
                        this.email.length <= 255
                        &&
                        this.message != null
                        && 
                        this.message != ''
                        &&
                        this.message.length <= 2048
                        &&
                        this.accepted 
                    ){
                    axios.post('http://127.0.0.1:8000/api/contacts', {
                        name: this.name,
                        email: this.email,
                        message: this.message,
                        accepted: this.accepted,
                        apartment_id: this.apartmentId
                    })
                    .then(res => {
                        console.log('RISPOSTA API', res.data);
                        console.log('ID APPARTAMENTO', this.apartment_id);

                        if (res.data.success) {
                            this.messageSent = true;
                            this.showError = false;
                        }
                    })
                    .catch(err => {
                        console.log('ERRORE AXIOS', err);
                        this.alert = true;
                        this.showError = true;
                        this.alert = false
                        //resetta il form
                        this.resetForm();
                    })
                        
                }
                else {
                    this.alert = true; 
                }
            },
            resetForm(){
                this.name = '';
                this.email = '';
                this.message = '';
                this.accepted = false;
                this.alert = false;
                this.messageSent = false;
                this.apartmentId = null;
            },
            initTomTomMap(lat, lon) {
            const map = tt.map({
                key: 'x5vTIPGVXKGawffLrAoysmnVC9V0S8cq',
                container: 'mapId',
                center: [lon, lat], // Inverti l'ordine di lon e lat
                zoom: 10
            });

            // Aggiungi un marker al centro della mappa
            map.on('load', () => {
                new tt.Marker().setLngLat([lon, lat]).addTo(map);
            });
        },
        getViews() {
            axios.post(`http://127.0.0.1:8000/api/get-views/${this.$route.params.slug}`)
                .then(response => {
                    console.log('Visualizzazione registrata con successo');
                    // Puoi aggiornare il tuo frontend con le visualizzazioni registrate
                })
                .catch(error => {
                    console.error('Errore durante la registrazione della visualizzazione:', error);
                });
        }            
        },
        computed: {
            // Calcolo della parte intera del prezzo
            priceInteger() {
            return Math.floor(this.apartment.price);
            },
            // Calcolo della parte decimale del prezzo
            priceDecimal() {
            return (this.apartment.price % 1).toFixed(2).substring(1);
            }
        }
            
    };
    

</script>

<template>
    
        <div class="container p-5 single_apartment_container">
            <div class="row  justify-content-between ">
                
                <!-- dati appartamento -->
                <div v-if="apartment != null" class="col-12 col-sm-12 col-md-12 col-lg-6  single-apartment pe-lg-5">
                    <div>
                        <img :src="'http://127.0.0.1:8000/storage/' + apartment.cover_img" :alt="apartment.title">
                    </div>

                    <div class="mt-3">
                        <h2 >
                            {{ apartment.title }}
                        </h2>
                        <div class="color-1">
                            {{ apartment.address }}
                        </div>
                        <p>
                            <span>{{ apartment.n_rooms }} Stanze</span> <span>{{ apartment.n_beds }}<abbr title="letti"><i class="fa-solid fa-bed px-1"></i></abbr></span> <span> {{ apartment.n_baths }}  <abbr title="bagno"><i class="fa-solid fa-bath px-1 "></i></abbr></span>  <span>{{ apartment.mq }} m²</span>  
                        </p>
                    </div>
                    <hr>
                    
                
                    <div class="row">
                        <div class="">Servizi inclusi:</div>
                        <div class="col-12">
                            
                        <span v-if="apartment.services.length > 0">
                            <span v-for="service in apartment.services" :key="service.id" class="m-2 service-item">
                                <i :class="service.icon + ' pe-2'"></i> {{ service.title }}
                            </span>
                        </span>
                        <span v-else>Nessun servizio incluso</span>
                        </div>
                    </div>
                    <hr>
                    <div>
                    <p class="">
                            
                            <b> 
                            <span  class="price-integer">{{ priceInteger }}</span>
                            <span class="price-decimal ">{{ priceDecimal }}</span>
                            </b>€/notte
                        </p>  
                    </div>
                </div>     

                <!-- form -->
                <div class="col-12 col-sm-12 col-md-12 col-lg-6 mt-4 mt-lg-0 justify-content-end form_container ps-lg-5 ">
                    <div v-if="!alert && !messageSent"  id="form-container" >
                        <h3>
                            Vuoi contattare il propretario dell'immobile?
                        </h3>
                        <form method="POST" @submit.prevent="sendMessage()">
                            <div class="mb-3">
                                <label for="name" class="form-label">Nome</label>
                                <input v-model="name" type="text" class="form-control" id="name" name="name" placeholder="Inserisci il tuo nome.." required maxlength="64">
                            </div>
                            <div class="mb-3">
                                <label for="exampleFormControlInput1" class="form-label">Email address</label>
                                <input v-model="email" type="email" class="form-control" id="exampleFormControlInput1" name="email" placeholder="name@example.com" required maxlength="255">
                            </div>
                            <div class="mb-3">
                                <label for="exampleFormControlTextarea1" class="form-label">Scrivi un messaggio</label>
                                <textarea v-model="message" class="form-control" id="exampleFormControlTextarea1" name="message" rows="3" required maxlength="2048"></textarea>
                            </div>

                            <div class="mb-3">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="accepted">
                                <label class="form-check-label ms-1" for="flexCheckChecked" required>
                                    Accetto i <a href="#nogo">Termini e le Condizioni</a>
                                </label>                
                            </div>
                            
                            <button type="submit" class="btn submit_button">
                                Invia
                            </button>
                            <button @click="resetForm()" class="btn ms-3 reset_button btn-secondary border-0 " >
                                Resetta
                            </button>
                        </form>
                    
                    </div>
                    <div v-if="alert" class="card">
                        <div class="card-body">
                            Dati inseriti non correttamente
                        </div>
                    </div>
                    <div v-if="messageSent" class="card mt-5">
                        <div class="card-body text-success">
                            Messaggio inviato correttamente
                        </div>
                    </div>
                </div>
            </div>

                <!-- Mappa -->
                <div class="col-sm-12 mt-3">
                    <div id="mapId" style="height: 400px;"></div>
                </div>
        </div>
        

        
    
</template>

<style lang="scss" scoped>
@use '../assets/SCSS/partials/variables.scss' as *;
.service-item {
    white-space: nowrap; 
}

.service-item i {
    vertical-align: middle; 
}

.service-item span {
    word-wrap: break-word; 
}
#map {
    width: 100%;
    height: 100%;
}

.single-apartment {

    
    img {
        width: 100%;
        box-sizing: border-box;
        border-radius: 20px;
        overflow: hidden;
    }
}


.color{
    color: black;
    
}
.color-1{
    color: rgb(122, 119, 119);
}

.form_container {

    h3{
        color: rgb(59, 57, 57);
        margin: 20px 0;
    }

    #form-container{
        border: 1px solid grey;
        padding: 10px;
        border-radius: 5%;
    }
    

    form{
        
        label{
            color: black;
            &:last-child{
                color: black;
            }
        }
        .submit_button{
            
                border: 0;
                padding: 7px 10px;
                border-radius: 50px;
                background-color: #ea4c89f8;
                color: white;
            
        }
        
    }

    .reset_button{
        
        background-color: #cbcbcb;
        border: 0.5px solid rgba(0, 0, 0, 0.521);
        border-radius: 50px;
        color: white;
        padding: 7px 10px;
    }

    
    
}
.price-integer {
        font-size: 20px; 
    }

    .price-decimal {
       font-size: 12px; 
    }

</style>