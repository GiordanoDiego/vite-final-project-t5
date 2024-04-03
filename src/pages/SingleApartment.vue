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
                apartmentId: null 
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
                            }
                        })
                        .catch(err => {
                            console.log('ERRORE AXIOS', err);

                            this.alert = true;
                        })
                }
                else {
                    this.alert = true; 
                }
            }
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

            <div>
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

        <section>
            <div v-if="alert == false"  id="form-container">
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

                    <button type="submit" class="btn btn-primary">
                        Invia
                    </button>
                </form>
            </div>
            <div v-else class="card">
                <div class="card-body">
                    Dati inseriti non correttamente
                </div>
            </div>
            <div v-show="messageSent" class="card mt-5">
                <div class="card-body text-success">
                    Messaggio inviato correttamente
                </div>
            </div>
        </section>
    
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