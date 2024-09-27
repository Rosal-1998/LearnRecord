import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import HighchartsVue from 'highcharts-vue';
const app = createApp(App)

app.use(router)
app.use(HighchartsVue)
app.mount('#app')
