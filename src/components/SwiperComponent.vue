<template>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in items" :key="index">
          <!-- Contenuto dello slide -->
          {{ item }}
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </template>
  
  <script>
  import Swiper from 'swiper';
  
  export default {
    data() {
      return {
        swiper: null,
        items: ['Slide 1', 'Slide 2', 'Slide 3'] // Esempio di dati per gli slide
      };
    },
    mounted() {
      // Inizializza Swiper nel ciclo di vita mounted del componente
      this.swiper = new Swiper('.swiper-container', {
        // Opzioni Swiper qui
        pagination: {
          el: '.swiper-pagination',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    },
    beforeDestroy() {
      // Distruggi Swiper nel ciclo di vita beforeDestroy per evitare memory leak
      if (this.swiper) {
        this.swiper.destroy();
      }
    }
  };
  </script>
  
  <style>
  /* Stili personalizzati per il componente Swiper */
  </style>
  