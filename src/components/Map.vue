<script setup lang="ts">
import { useThemeStore } from "@/stores/ThemeStore";
import maplibre from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import { onMounted, useTemplateRef, watch } from "vue";

const mapRef = useTemplateRef('map');
const themeStore = useThemeStore();

const STYLE_URLS = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/dark',
};

onMounted(() => {
  if (!mapRef.value) return;

  const map = new maplibre.Map({
    container: mapRef.value,
    style: STYLE_URLS[themeStore.value],
  });

  map.addControl(new maplibre.GeolocateControl({ trackUserLocation: true }));
  map.addControl(new maplibre.GlobeControl());

  watch(
    () => themeStore.value,
    (value) => {
      const newStyle = STYLE_URLS[value];
      map.setStyle(newStyle, { diff: true });
    }
  );
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
