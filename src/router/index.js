import { createRouter, createWebHistory } from 'vue-router'
import { hideStatusBar } from '@/plugins/statusBar'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
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
      component: () => import('@/views/CardFormView.vue'),
    },
    {
      path: '/decks/:id/:cardId/edit',
      name: 'edit-card',
      component: () => import('@/views/CardFormView.vue'),
    },
    {
      path: '/decks/:id',
      name: 'deck',
      component: () => import('@/views/DeckView.vue'),
      beforeEnter: async (_, __, next) => {
        await hideStatusBar()
        next()
      },
    }
  ]
})

export default router