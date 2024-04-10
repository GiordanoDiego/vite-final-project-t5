

<script>
export default {
  data() {
    return {
       // ID del container della mappa
      center: [4, 44, 4], // Coordinate del centro della mappa
      
    };
  },
  mounted() {
    //this.loadTomTomMapsScript();
    this.initTomTomMap();
  },
  methods: {
    loadTomTomMapsScript() {
      // Crea un elemento script e aggiungilo al body del documento
      const script = document.createElement('script');
      script.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.15.0/maps-web.min.js';

      // Aggiungi un listener per gestire il caricamento dello script
      script.onload = this.initTomTomMap;

      // Aggiungi lo script al documento
      document.body.appendChild(script);
    },
    initTomTomMap() {
      // Inizializza la mappa TomTom
      let center =  [4,44.4]
      const map = tt.map({
        key: 'x5vTIPGVXKGawffLrAoysmnVC9V0S8cq',
        container: 'mapId',
        center: center,
        zoom: 10
      });

      // Aggiungi un marker al centro della mappa
      map.on('load', () => {
        new tt.Marker().setLngLat(center).addTo(map);
      });
    }
  }
};
</script>


<template>
  <div id="mapId" style="width: 40vw; height: 350px;"></div>
</template>

<style scoped>
/* Stili specifici del componente, se necessario */
</style>

  