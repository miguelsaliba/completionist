<template>
  <div id="map" ref="map"></div>
</template>

<script setup lang="ts">
import type { Location } from "@capacitor-community/background-geolocation";
import maplibre, { Marker } from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import { onMounted, ref, useTemplateRef, watchEffect } from "vue";

const { pos } = defineProps<{ pos: Location | null }>()

const marker = ref<Marker | null>(null);
const mapRef = useTemplateRef('map');

watchEffect(() => {
  if (pos && marker.value) {
    const { longitude, latitude } = pos;
    marker.value.setLngLat([longitude, latitude]).setOpacity('1');
  }
}
);

onMounted(() => {
  if (!mapRef.value) return;

  const mapStyle = 'https://tiles.openfreemap.org/styles/liberty';

  const map = new maplibre.Map({
    container: mapRef.value,
    style: `${mapStyle}`,
  });

  marker.value = new maplibre.Marker()
    .setOpacity('0')
    .setLngLat([0, 0])
    .addTo(map);
})

</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
