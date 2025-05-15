import { createApp } from 'vue';
import App from './App.vue';
import naive from 'naive-ui';
import { createPinia } from 'pinia';
import router from './router';
import i18n from './i18n';
import './assets/main.css';

const app = createApp(App);
app.use(naive);
app.use(router);
app.use(i18n);
app.use(createPinia());
app.mount('#app'); 