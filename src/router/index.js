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
      component: () => import('@/views/DeckFormView.vue')
    },
    {
      path: '/decks/:id/edit',
      name: 'edit-deck',
      component: () => import('@/views/DeckFormView.vue'),
    },
    {
      path: '/decks/:id/new-card',
      name: 'new-card',
      component: () => import('@/views/NewCardView.vue'),
    },
    {
      path: '/slides/:id',
      name: 'slides',
      component: () => import('@/views/SlidesView.vue'),
    }
  ]
})

export default router