<script setup lang="ts">
import Map from './components/Map.vue';
import { useLocationStore } from './stores/LocationStore';

const locationStore = useLocationStore();
</script>

<template>
  <div>
    <Map />

    <div class="fixed left-0 right-0 bottom-20 flex justify-center items-center w-full font-semibold size-4 transition-colors ease-in-out">
      <button v-if="!locationStore.isWatching" @click="locationStore.startWatching()"
        class="bg-gray-600/30 text-gray-800 backdrop-blur-sm border-2 border-gray-800 dark:border-white
        dark:text-white hover:backdrop-invert-10 rounded-2xl">
        Start
      </button>

      <button v-else @click="locationStore.stopWatching()"
        class="bg-red-600/30 text-gray-800 backdrop-blur-sm border-2 border-gray-800 dark:border-white
        dark:text-white hover:backdrop-invert-10 rounded-2xl">
        Stop
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  outline: none;
  padding: 1rem 2rem;
  letter-spacing: 0.05rem;
}
</style>
