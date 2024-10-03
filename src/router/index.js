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
      path: '/collection/:id',
      name: 'collection',
      component: () => import('@/views/HomeView.vue'),
      props: true
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'collection') {
    import('@/views/HomeView.vue')
  }
  next()
})

export default router