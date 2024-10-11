import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { IndexedDBController } from '@/data/indexedDBController'

const initApp = async () => {
  try {
    const dataController = IndexedDBController.getInstance()
    await dataController.initializeDB()

    const app = createApp(App)

    app.use(createPinia())
    app.use(router)

    app.mount('#app')
  } catch (error) {
    console.error(error)
  }
}

initApp()
