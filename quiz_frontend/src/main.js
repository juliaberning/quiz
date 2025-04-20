import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import useUserStore from './stores/user'

axios.defaults.baseURL = 'http://127.0.0.1:8000/'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(vuetify)
app.use(router)

// Initialize the user store
const userStore = useUserStore(pinia)
userStore.initStore()

app.mount('#app')
