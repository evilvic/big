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
      path: '/slides/:id',
      name: 'slides',
      component: () => import('@/views/SlidesView.vue'),
    }
  ]
})

export default router