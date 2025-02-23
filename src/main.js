import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useDataProcessor } from './scripts/dataProcessor'

const { loadData } = useDataProcessor()

const app = createApp(App)

loadData().then(() => {
  app.use(router).mount('#app')
})