import { createApp } from 'vue'
import App from './App.vue'

// import bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css'

// PrimeVue
import PrimeVue from 'primevue/config'

// import './style.css'

const app = createApp(App)

app.use(PrimeVue)

app.mount('#app')