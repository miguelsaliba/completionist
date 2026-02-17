<script setup lang="ts">
import Map from './components/Map.vue';
import { useLocationStore } from './stores/LocationStore';

const locationStore = useLocationStore();
</script>

<template>
  <div>
    <!-- Should use a separate way of getting the location -->
    <Map :pos="locationStore.lastPosition"/>
    <div class="bottom-bar">
      <button v-if="!locationStore.isWatching" @click="locationStore.startWatching()"
        class="rounded-full font-semibold border bg-pink-700 border-pink-100 hover:bg-pink-700">Start</button>
      <button v-else @click="locationStore.removeWatcher()"
        class="rounded-full font-semibold border bg-pink-700 border-pink-100 hover:bg-pink-700">Stop</button>
    </div>
  </div>
</template>

<style scoped>
button {
  outline: none;
  cursor: pointer;
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
