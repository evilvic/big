import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'collections',
      component: () => import('@/views/CollectionsView.vue')
    },
    {
      path: '/collections/new',
      name: 'new-collection',
      component: () => import('@/views/NewCollectionView.vue')
    },
    {
      path: '/slides/:id',
      name: 'slides',
      component: () => import('@/views/SlidesView.vue'),
    },
    {
      path: '/collections/:id/config',
      name: 'collection-config',
      component: () => import('@/views/DeckConfigView.vue'),
    }
  ]
})

export default router