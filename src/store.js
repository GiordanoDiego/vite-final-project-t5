import { reactive } from 'vue';

export const store = reactive({
    // Definisco un array vuoto dove andrò ad inserire gli Appartamenti
    apartments: [],
    // Definisco un altro array vuoto dove inserirò una copia degli Appartamenti
    originalApartments: [],
    // Definisco una variabile che utilizzerò per filtrare per indirizzo
    searchAddress: '',
    // Definisco un array vuoto che verrà popolato con i servizi disponibili
    services:[],
    // Definisco un array vuoto per gli appartamenti filtrati
    filteredApartments: [],
    // ApiKey TomTom
    apiKey: 'x5vTIPGVXKGawffLrAoysmnVC9V0S8cq',
    // Creo una flag per la distanza in advSearch
    distance: false,
    // Dichiaro una funzione per spezzare i nomi degli apt e gli indirizzi quando sono troppo lunghi
    truncateString(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '\u2026'
    }
});
