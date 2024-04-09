<script>
import axios from 'axios';
import { TTMap } from '@tomtom-international/web-sdk-maps';


export default 
{
  props: 
  {
    coordinates: 
    {
      type: Object,
      required: true
    }
  },
  mounted()
   {
      const map = TTMap.create
        (
            {
                key: 'x5vTIPGVXKGawffLrAoysmnVC9V0S8cq',
                container: this.$refs.map,
                center: [this.coordinates.longitude, this.coordinates.latitude],
                zoom: 15
            }
        );
        const marker = new TT.Marker().setLngLat([this.coordinates.longitude, this.coordinates.latitude]).addTo(map);
   }
};

</script>



<template>
    <div ref="map" class="mappa" >

    </div>
  </template>



<style lang="scss" scoped>
.mappa{
    width: 100%; 
    height: 400px;
}
</style>
