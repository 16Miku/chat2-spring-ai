// 从 'vue-router' 库导入创建路由实例和创建 history 模式的函数
import { createRouter, createWebHistory } from 'vue-router'
// 导入需要作为路由组件渲染的组件
import ChatView from '../views/ChatView.vue'
import HomePage from '../views/HomePage.vue'
import EcommerceAIChatView from '../views/EcommerceAIChatView.vue' // <--- 添加这行导入

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式，这样可以使用干净的 URL（没有 # 号）
  history: createWebHistory(import.meta.env.BASE_URL),
  // 定义路由映射
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView
    },
    // 可以根据需要添加更多路由
    {
      path: '/gallery',
      name: 'gallery',
      // 使用懒加载方式，只有在访问该路由时才会加载组件
      component: () => import('../views/GalleryView.vue')
    },
    {
      path: '/music',
      name: 'music',
      component: () => import('../views/MusicView.vue')
    },
    {
      path: '/luotianyi',
      name: 'luotianyi',
      component: () => import('../views/LuoTianYiView.vue')
    },
    {
      path: '/ecommerce-chat', // 与 router-link 中的 'to' 属性匹配
      name: 'ecommerce-chat',
      component: EcommerceAIChatView
    }
  ]
})

export default router