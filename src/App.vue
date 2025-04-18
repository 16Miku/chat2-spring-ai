<template>
  <!-- 应用的根容器 -->
  <div class="app-container">
    <!-- 应用的页眉部分 -->
    <header class="app-header">
      <!-- 应用标题 -->
      <h1 class="app-title">初音未来 AI 助手</h1>
    </header>
    
    <!-- 应用的主要内容区域 -->
    <main class="app-content">
      <!-- Vue Router 的视图渲染出口 -->
      <!-- 这里会根据当前路由动态显示对应的组件 (例如 ChatView.vue) -->
      <router-view />
    </main>
    
    <!-- 应用的页脚部分 -->
    <footer class="app-footer">
      <!-- 版权信息 -->
      <p>© 2023 初音未来 AI 助手</p>
    </footer>
  </div>
</template>

<script>
// 导出 Vue 组件定义
export default {
  // 定义组件的名称，方便在开发者工具中识别
  name: 'App'
}
</script>

<style lang="scss">
/* 定义全局 CSS 变量，用于主题配色 */
:root {
  --miku-teal: #39c5bb; /* 初音未来主题的青色 */
  --miku-dark: #2d2d2d; /* 深灰色，用于文本或背景 */
  --miku-light: #f5f5f5; /* 浅灰色，用作背景色 */
}

/* 全局样式重置和基础设置 */
* {
  box-sizing: border-box; /* 让元素的 padding 和 border 不会增加元素的总宽度和高度 */
  margin: 0; /* 移除所有元素的默认外边距 */
  padding: 0; /* 移除所有元素的默认内边距 */
}

/* body 元素的基础样式 */
body {
  font-family: 'Arial', sans-serif; /* 设置默认字体 */
  background-color: var(--miku-light); /* 设置页面背景色 */
  color: var(--miku-dark); /* 设置默认文字颜色 */
}

/* 应用根容器的样式 */
.app-container {
  min-height: 100vh; /* 最小高度为视口高度，确保页脚总在底部 */
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 子元素垂直排列 */
}

/* 页眉样式 */
.app-header {
  background-color: var(--miku-teal); /* 设置页眉背景色 */
  color: white; /* 设置页眉文字颜色 */
  padding: 1rem; /* 设置内边距 */
  text-align: center; /* 文字居中显示 */
}

/* 主要内容区域样式 */
.app-content {
  flex: 1; /* 占据剩余的垂直空间，将页脚推到底部 */
  padding: 1rem; /* 设置内边距 */
}

/* 页脚样式 */
.app-footer {
  background-color: var(--miku-dark); /* 设置页脚背景色 */
  color: white; /* 设置页脚文字颜色 */
  text-align: center; /* 文字居中显示 */
  padding: 0.5rem; /* 设置内边距 */
  font-size: 0.8rem; /* 设置较小的字体大小 */
}
</style>
