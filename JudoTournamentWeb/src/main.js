import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { installI18n } from './i18n'

const pinia = createPinia()
const app = createApp(App)
installI18n(app)
app.use(pinia)
app.use(router)
app.mount('#app')
