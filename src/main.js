import '@/assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

try {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  app.mount('#app')
} catch (error) {
  console.error(error)
}

