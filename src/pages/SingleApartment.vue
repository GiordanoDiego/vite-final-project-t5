<script >
import axios from 'axios';

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
    /*mounted() {
    //this.loadTomTomMapsScript();
    this.initTomTomMap();
  },*/
    
        
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
           /* initTomTomMap() {
                // Inizializza la mappa TomTom
                let center =  [4,44.4]
                const map = tt.map({
                    key: '3lvx7A4Usgik9PGmpGZi4Q9yZlaw47Oi',
                    container: 'mapId',
                    center: center,
                    zoom: 10
                });

             // Aggiungi un marker al centro della mappa
             map.on('load', () => {
                 new tt.Marker().setLngLat(center).addTo(map);
            });
        }*/
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
    
       <!-- <div id="mapId" style="width: 40vw; height: 350px;"></div>-->

        <div class="row  justify-content-between ">

           

            <div v-if="apartment != null" class="col-sm-6  single-apartment ">
                

                <h2 class="text-center">
                    {{ apartment.title }}
                </h2>

                <div>
                    <img :src="'http://127.0.0.1:8000/storage/' + apartment.cover_img" :alt="apartment.title">
                </div>

                <div class="mt-3">
                    <h4>
                        {{ apartment.address }}
                    </h4>
                    <p>
                        <span>{{ apartment.n_rooms }} Stanze</span> <span> {{ apartment.n_baths }} Bagni</span>  <span>{{ apartment.mq }} m²</span>  
                    </p>
                </div>
                <hr>
                
              
                <div class="row">
                    <div>Servizzi:</div>
                    <div class="col-12">
                         
                    <span v-if="apartment.services.length > 0">
                        <span v-for="service in apartment.services" :key="service.id" class=" color badge rounded-pill m-2 ">
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
        
            <section class="col-sm-6  justify-content-end">
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
                    <button @click="resetForm()" class="btn ms-3 reset_button btn-secondary" >
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
            </section>
        </div>

        

        
    
</template>

<style lang="scss" scoped>
@use '../assets/SCSS/partials/variables.scss' as *;

#map {
        width: 100vw;
        height: 100vh;
      }

.single-apartment {
   width: 500px;
    
    img {
        width: 100%;
        box-sizing: border-box;
        border-radius: 10%;
        overflow: hidden;
    }
}


.color{
    color: black;
    
}

section {
    

    h3{
        color: black;
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