<script setup lang="ts">
import maplibre from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import { onMounted, useTemplateRef } from "vue";

const mapRef = useTemplateRef('map');

onMounted(() => {
  if (!mapRef.value) return;

  const mapStyle = 'https://tiles.openfreemap.org/styles/liberty';

  const map = new maplibre.Map({
    container: mapRef.value,
    style: mapStyle,
  });

  map.addControl(new maplibre.GeolocateControl({ trackUserLocation: true }));
})

</script>

<template>
  <div id="map" ref="map"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
