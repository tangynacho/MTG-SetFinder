import App from './App.vue'
// Composables
import { createApp } from 'vue'
// Plugins
import { registerPlugins } from '/src/plugins'
import cors from 'cors'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)
registerPlugins(app)
app.use(cors)
app.mount('#app')