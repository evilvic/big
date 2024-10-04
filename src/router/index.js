import { createRouter, createWebHistory } from 'vue-router'
import { useCollectionsStore } from '@/stores/collectionStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'collections',
      component: () => import('@/views/CollectionsView.vue')
    },
    {
      path: '/collection/:id',
      name: 'collection',
      component: () => import('@/views/HomeView.vue'),
    }
  ]
})

export default router