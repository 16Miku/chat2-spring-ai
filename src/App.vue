<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">初音未来 AI 助手</h1>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>© 2023 初音未来 AI 助手</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
:root {
  --miku-teal: #39c5bb;
  --miku-dark: #2d2d2d;
  --miku-light: #f5f5f5;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--miku-light);
  color: var(--miku-dark);
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--miku-teal);
  color: white;
  padding: 1rem;
  text-align: center;
}

.app-content {
  flex: 1;
  padding: 1rem;
}

.app-footer {
  background-color: var(--miku-dark);
  color: white;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.8rem;
}
</style>
