import { createApp } from 'vue'
import { router } from './router.js'

import App from './App.vue'

import * as bootstrap from 'bootstrap'

createApp(App).use(router).mount('#app');