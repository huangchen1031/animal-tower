import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
    },
    // 使用更明确的通配符路径匹配
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    }
  ],
})

// 添加路由导航守卫用于调试
router.beforeEach((to, from) => {
  console.log('路由跳转:', from.path, '->', to.path)
})

export default router
