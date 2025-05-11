import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useDataProcessor } from './scripts/dataProcessor'

const { loadData } = useDataProcessor()

const app = createApp(App)

loadData()
  .then(() => {
    app.use(router).mount("#app");
  })
  .catch((err) => {
    console.error("Data load failed:", err);
    app.use(router).mount("#app"); // sigue montando la app
  });
