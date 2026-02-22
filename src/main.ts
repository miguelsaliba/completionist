import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useThemeStore } from './stores/ThemeStore'

const app = createApp(App);
app.use(createPinia());
app.mount('#app');

const themeStore = useThemeStore();
themeStore.initializeThemeListener();
