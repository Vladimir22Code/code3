import { createApp } from 'vue'
import App from './App.vue'
import PhosphorVue from 'phosphor-vue'

const app = createApp(App)
app.use(PhosphorVue)
app.mount('#app')
