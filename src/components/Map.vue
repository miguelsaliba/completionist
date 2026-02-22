<script setup lang="ts">
import { databaseService } from "@/services/database";
import { generateGeojson } from "@/services/geojson";
import { useThemeStore } from "@/stores/ThemeStore";
import maplibre from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import { storeToRefs } from "pinia";
import { onMounted, useTemplateRef, watch } from "vue";

const mapRef = useTemplateRef('map');
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

const styleUrls = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/dark',
};

onMounted(async () => {
  if (!mapRef.value) return;

  const map = new maplibre.Map({
    container: mapRef.value,
    style: styleUrls[theme.value] ?? styleUrls.dark,
  });

  map.addControl(new maplibre.GeolocateControl({ trackUserLocation: true }));
  map.addControl(new maplibre.GlobeControl());

  watch(theme,
    (value) => {
      const newStyle = styleUrls[value] ?? styleUrls.dark;
      map.setStyle(newStyle, { diff: true });
    }
  );

  await databaseService.init();
  const geojsonData = await generateGeojson();
  console.log(geojsonData);
  map.addSource('location', { type: 'geojson', data: geojsonData });
  map.addLayer({
    id: 'track-lines',
    type: 'line',
    source: 'location',
    filter: ['==', '$type', 'LineString'],
    paint: {
      'line-color': '#ff6b6b',
      'line-width': 3,
      'line-opacity': 0.7,
    },
  });
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
