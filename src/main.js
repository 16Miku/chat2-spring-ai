// 从 'vue' 库中导入 createApp 函数，用于创建 Vue 应用实例
import { createApp } from 'vue'
// 导入应用的根组件 App.vue
import App from './App.vue'
// 导入路由配置文件中创建的 router 实例
import router from './router'

// 导入全局 CSS 样式文件
import './assets/main.css'

// 使用根组件 App 创建 Vue 应用实例
const app = createApp(App)
// 在 Vue 应用实例上注册路由插件 (Vue Router)
// 这使得 <router-link> 和 <router-view> 组件以及 $router 和 $route 对象在整个应用中可用
app.use(router)
// 将 Vue 应用实例挂载到 index.html 文件中 ID 为 'app' 的 DOM 元素上
// 这是启动 Vue 应用的最后一步
app.mount('#app')
