import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { setupI18n } from './i18n';
import router from './router';
import 'tdesign-vue-next/es/style/index.css';
import './style.css';
import './assets/styles/theme.less';
import 'virtual:uno.css';

import permPlugin from '@/directives/permission';

const pinia = createPinia();
const app = createApp(App);

setupI18n(app);
app.use(pinia);
app.use(router);
app.use(permPlugin);

app.mount('#app');
