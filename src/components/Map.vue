<script setup lang="ts">
import { databaseService } from "@/services/database";
import { generateGeojson, generateGeojsonDiff } from "@/services/geojson";
import { useLocationStore } from "@/stores/LocationStore";
import { useThemeStore } from "@/stores/ThemeStore";
import maplibre, { GeoJSONSource } from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import { storeToRefs } from "pinia";
import { onMounted, useTemplateRef, watch } from "vue";

const mapRef = useTemplateRef('map');
const themeStore = useThemeStore();
const locationStore = useLocationStore();
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

  // TODO: This is ok for now but definitely needs to be handled differently at some point
  await databaseService.init();
  const geojsonData = await generateGeojson();
  map.addSource('location', { type: 'geojson', data: geojsonData });
  map.addLayer({
    id: 'track-lines',
    type: 'line',
    source: 'location',
    paint: {
      'line-color': '#ff6b6b',
      'line-width': 3,
      'line-opacity': 0.7,
    },
  });

  watch(() => locationStore.sessionPoints.length,
    async () => {
      if (!locationStore.sessionId || !locationStore.sessionPoints.length) return;
      const diff = generateGeojsonDiff(locationStore.sessionPoints, locationStore.sessionId);
      const source = map.getSource('location');
      if (!(source instanceof GeoJSONSource) || !diff) return;
      await source.updateData(diff, true);
    }
  );
})

</script>

<template>
  <div id="map" ref="map" class="w-full h-lvh absolute inset-0"></div>
</template>
