import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'decks',
      component: () => import('@/views/DecksView.vue')
    },
    {
      path: '/decks/new',
      name: 'new-deck',
      component: () => import('@/views/NewDeckView.vue')
    },
    {
      path: '/decks/:id/config',
      name: 'deck-config',
      component: () => import('@/views/DeckConfigView.vue'),
    },
    {
      path: '/slides/:id',
      name: 'slides',
      component: () => import('@/views/SlidesView.vue'),
    }
  ]
})

export default router