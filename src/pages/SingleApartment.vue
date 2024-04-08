<script >
import axios from 'axios';
    export default {
        data() {
            return {
                apartment: null,
                name: '',
                email: '',
                message: '',
                accepted: false,
                alert: false,
                messageSent: false,
                apartmentId: null,
                showError: false
            };
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
                ) {
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
            }
        },
        created() {
            this.getApartment();
        }
    }
</script>

<template>
        <div class="d-flex col-12 justify-content-between ">
            <div v-if="apartment != null" class="col-3 single-apartment ">

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
                
                <div v-for="sponsor in apartment.sponsors" :key="sponsor.id">
                    <h5 class="my-3 text-success">
                        Sponsor: {{ sponsor?.title ?? 'NULL' }}
                        <!-- Sponsor: {{ sponsor ? sponsor.title : 'NULL' }} -->
                    </h5>
                </div>
                <hr>
                <div class="row">
                    <div class="col-12">
                        Servizi: 
                    <span v-if="apartment.services.length > 0">
                        <span v-for="service in apartment.services" :key="service.id" class="badge rounded-pill text-bg-primary">
                            <i :class="service.icon + ' pe-2'"></i> {{ service.title }}
                        </span>
                    </span>
                    <span v-else>Nessun servizio incluso</span>
                    </div>
                </div>
                <hr>
            </div>     
        
            <section class="col-4 justify-content-end">
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
                </form>
                <button @click="resetForm()" class="btn ms-3 reset_button btn-secondary" >
                    Resetta
                </button>
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

.single-apartment {
   width: 500px;
    
    img {
        width: 100%;
        box-sizing: border-box;
        border-radius: 10%;
        overflow: hidden;
    }
}

section {
    position: relative;

    h3{
        color: $secondary_text_color;
        margin: 20px 0;
    }

    #form-container{
        border: 1px solid coral;
        padding: 10px;
        border-radius: 5%;
    }
    

    form{
        
        label{
            color: $primary_text_color;
            &:last-child{
                color: black;
            }
        }
        .submit_button{
            background-color: $primary_background_color;
            color: $secondary_text_color;
        }
        
    }

    .reset_button{
        position: absolute;
        right: 0;
        bottom: 0;
        margin: 10px;
    }
    
}

</style>