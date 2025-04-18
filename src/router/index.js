// 从 'vue-router' 库导入创建路由实例和创建 history 模式的函数
import { createRouter, createWebHistory } from 'vue-router'
// 导入需要作为路由组件渲染的 ChatView 组件
import ChatView from '../views/ChatView.vue'

// 创建 Vue Router 实例
const router = createRouter({
  // 配置路由历史模式
  // createWebHistory 使用 HTML5 History API 来实现无 '#' 的 URL
  // import.meta.env.BASE_URL 是 Vite 提供的环境变量，通常是 '/'，用于正确处理应用的基路径
  history: createWebHistory(import.meta.env.BASE_URL),
  // 定义应用的路由规则数组
  routes: [
    // 定义一个路由对象
    {
      // path: 指定路由的 URL 路径
      path: '/',
      // name: 给路由命名，方便在代码中通过名称进行导航 (例如 router.push({ name: 'home' }))
      name: 'home',
      // component: 指定当访问该路径时要渲染的 Vue 组件
      component: ChatView // 将 ChatView 组件设置为根路径 ('/') 的默认显示内容
    },
    // 这里可以添加更多的路由对象来定义其他页面的路径和组件
    // 例如:
    // {
    //   path: '/about',
    //   name: 'about',
    //   // 路由懒加载，只有访问 /about 时才会加载 AboutView.vue
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

// 导出创建好的 router 实例，以便在 main.js 中引入并注册到 Vue 应用中
export default router