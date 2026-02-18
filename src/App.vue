<script setup lang="ts">
import Map from './components/Map.vue';
import { useLocationStore } from './stores/LocationStore';
import { useThemeStore } from './stores/ThemeStore';

const locationStore = useLocationStore();
const themeStore = useThemeStore();
themeStore.initializeThemeListener();
</script>

<template>
  <div>
    <!-- Should use a separate way of getting the location -->
    <Map :pos="locationStore.lastPosition"/>
    <div class="bottom-bar">
      <button v-if="!locationStore.isWatching" @click="locationStore.startWatching()"
        class="rounded-2xl transition-colors ease-in-out font-semibold text-gray-800 backdrop-blur-sm border-2
        border-gray-800 bg-gray-600/30 dark:border-white dark:text-white hover:backdrop-invert-10">Start</button>
      <button v-else @click="locationStore.removeWatcher()"
        class="rounded-2xl transition-colors ease-in-out font-semibold text-gray-800 backdrop-blur-sm border-2
        border-gray-800 bg-red-600/30 dark:border-white dark:text-white hover:backdrop-invert-10">Stop</button>
    </div>
  </div>
</template>

<style scoped>
button {
  outline: none;
  padding: 1rem 2rem;
  margin: auto;
  letter-spacing: 0.05rem;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 2rem;
  display: flex;
  margin: auto;
  font-size: 17px;
}

.current-location {
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: grey;
}
</style>
