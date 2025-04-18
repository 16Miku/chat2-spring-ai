<template>
  <!-- 聊天界面的主容器 -->
  <div class="miku-chat-container">
    <!-- 聊天头部区域 -->
    <div class="chat-header">
      <!-- 初音未来头像 -->
      <img src="@/assets/miku-avatar.png" alt="初音未来" class="avatar">
      <!-- 聊天标题 -->
      <h2>初音未来 AI 助手</h2>
    </div>
    
    <!-- 聊天消息显示区域 -->
    <div class="chat-messages">
      <!-- 使用 v-for 遍历 messages 数组来渲染每条消息 -->
      <!-- :key="index" 为每个消息提供唯一的 key，用于 Vue 的列表渲染优化 -->
      <!-- :class="['message', msg.sender]" 动态绑定 class，基础 class 为 'message'，并根据发送者 ('user' 或 'miku') 添加对应的 class -->
      <div v-for="(msg, index) in messages" :key="index" 
           :class="['message', msg.sender]">
        <!-- 显示消息内容 -->
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>
    
    <!-- 聊天输入区域 -->
    <div class="chat-input">
      <!-- 输入框 -->
      <!-- v-model="inputMessage" 双向绑定输入框的值到 data 中的 inputMessage -->
      <!-- @keyup.enter="sendMessage" 监听回车键抬起事件，触发 sendMessage 方法 -->
      <input v-model="inputMessage" @keyup.enter="sendMessage" 
             placeholder="和初音未来聊天...">
      <!-- 发送按钮 -->
      <!-- @click="sendMessage" 监听点击事件，触发 sendMessage 方法 -->
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
// 导入 API 服务中定义的 API_BASE_URL (虽然 EventSource 直接用了，但保留导入可能为了其他 API 调用)
// 注意：getStreamChat 函数在此实现中未被使用，因为直接使用了 EventSource
import { getStreamChat, API_BASE_URL } from '@/services/api'

// 导出 Vue 组件定义
export default {
  // data 函数返回组件的响应式状态对象
  data() {
    return {
      // messages 数组用于存储聊天记录，每个元素是一个包含 sender 和 content 的对象
      messages: [],
      // inputMessage 字符串用于存储用户在输入框中输入的内容
      inputMessage: '',
      // currentStreamResponse 字符串用于临时存储当前正在接收的流式响应片段 (在此实现中未使用)
      currentStreamResponse: '' 
    }
  },
  // methods 对象包含组件的方法
  methods: {
    // sendMessage 方法用于处理用户发送消息的逻辑
    async sendMessage() {
      // 去除输入内容两端的空白，如果为空则不执行任何操作
      if (!this.inputMessage.trim()) return;
      
      // 创建用户消息对象
      const userMessage = {
        sender: 'user', // 发送者为用户
        content: this.inputMessage // 内容为输入框中的文本
      };
      // 将用户消息添加到 messages 数组中，触发界面更新
      this.messages.push(userMessage);
      
      // 创建一个初始的、内容为空的 AI 回复消息对象
      const mikuMessage = {
        sender: 'miku', // 发送者为 Miku
        content: '' // 初始内容为空，后续会通过流式响应填充
      };
      // 将空的 AI 回复消息添加到 messages 数组中，占位显示
      this.messages.push(mikuMessage);
      
      // 保存当前用户输入的消息，用于构建 EventSource URL
      const currentInput = this.inputMessage;
      // 清空输入框
      this.inputMessage = '';

      try {
        // 创建 EventSource 实例，连接到后端的 SSE (Server-Sent Events) 端点
        // URL 包含 API 基础地址和流式聊天的路径，并将用户输入作为查询参数传递
        // encodeURIComponent 用于确保输入中的特殊字符被正确编码
        const eventSource = new EventSource(`${API_BASE_URL}/stream-chat?input=${encodeURIComponent(currentInput)}`);
        
        // 监听 message 事件，当从服务器接收到新的事件时触发
        eventSource.onmessage = (event) => {
          // event.data 包含服务器发送的文本数据
          // 将接收到的文本追加到 mikuMessage 对象的 content 属性上
          mikuMessage.content += event.data; 
          // 由于 mikuMessage 是数组中的对象，直接修改其属性可能不会触发 Vue 的响应式更新
          // 调用 this.$forceUpdate() 强制 Vue 重新渲染组件，确保界面实时显示接收到的内容
          // 注意：过度使用 $forceUpdate 可能影响性能，但在此流式场景下有时是必要的
          this.$forceUpdate(); 
        };
        
        // 监听 error 事件，当连接发生错误时触发
        eventSource.onerror = (error) => {
          // 在控制台打印错误信息
          console.error('SSE Error:', error);
          // 更新 Miku 消息内容为错误提示
          mikuMessage.content = '抱歉，我遇到了一些问题，无法回应你的消息。';
          // 关闭 EventSource 连接，停止接收事件
          eventSource.close();
          // 强制更新视图以显示错误消息
          this.$forceUpdate();
        };

        // 监听 open 事件，当连接成功建立时触发 (可选)
        eventSource.onopen = () => {
          console.log("SSE Connection opened.");
        };
        
      } catch (error) {
        // 捕获创建 EventSource 或其他同步代码可能抛出的错误
        console.error('Error initiating SSE:', error);
        // 更新 Miku 消息内容为错误提示
        mikuMessage.content = '抱歉，我遇到了一些问题，无法回应你的消息。';
        // 强制更新视图
        this.$forceUpdate();
      }
      
      // 注意：sendMessage 方法执行完毕后，EventSource 连接仍然保持打开状态，
      // 直到服务器关闭连接或发生错误并调用 eventSource.close()。
    }
  }
}
</script>

<style lang="scss">
// 导入 Sass 的 color 模块，用于颜色函数 (例如 color.adjust)
@use "sass:color";

/* 聊天容器的整体样式 */
.miku-chat-container {
  /* 定义局部 CSS 变量，用于初音未来主题配色 */
  --miku-teal: #39c5bb; /* 主题青色 */
  --miku-dark: #2d2d2d; /* 深灰色 */
  
  max-width: 800px; /* 最大宽度限制 */
  margin: 0 auto; /* 水平居中 */
  padding: 20px; /* 内边距 */
  height: 100vh; /* 高度占满整个视口 */
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 子元素垂直排列 */
  background-color: #f5f5f5; /* 背景色 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  
  /* 聊天头部的样式 */
  .chat-header {
    display: flex; /* 使用 Flexbox 布局 */
    align-items: center; /* 垂直居中对齐子元素 */
    padding: 10px 0; /* 上下内边距 */
    border-bottom: 2px solid var(--miku-teal); /* 底部边框线 */
    margin-bottom: 20px; /* 底部外边距 */
    
    /* 头像样式 */
    .avatar {
      width: 50px; /* 宽度 */
      height: 50px; /* 高度 */
      border-radius: 50%; /* 圆形头像 */
      margin-right: 15px; /* 右侧外边距 */
      border: 2px solid var(--miku-teal); /* 头像边框 */
    }
    
    /* 标题样式 */
    h2 {
      color: var(--miku-teal); /* 标题颜色 */
      margin: 0; /* 移除默认外边距 */
    }
  }
  
  /* 聊天消息区域样式 */
  .chat-messages {
    flex: 1; /* 占据剩余的垂直空间 */
    overflow-y: auto; /* 内容超出时显示垂直滚动条 */
    padding: 10px; /* 内边距 */
    display: flex; /* 使用 Flexbox 布局 */
    flex-direction: column; /* 子元素（消息）垂直排列 */
    gap: 15px; /* 消息之间的间距 */
    
    /* 单条消息的通用样式 */
    .message {
      max-width: 80%; /* 最大宽度，避免消息过长 */
      padding: 10px 15px; /* 内边距 */
      border-radius: 18px; /* 消息气泡圆角 */
      position: relative; /* 用于可能的伪元素定位 */
      
      /* 用户发送的消息样式 */
      &.user {
        align-self: flex-end; /* 靠右对齐 */
        background-color: var(--miku-teal); /* 背景色 */
        color: white; /* 文字颜色 */
        border-bottom-right-radius: 5px; /* 修改右下角圆角，形成对话气泡尖角效果 */
      }
      
      /* Miku 发送的消息样式 */
      &.miku {
        align-self: flex-start; /* 靠左对齐 */
        background-color: white; /* 背景色 */
        color: var(--miku-dark); /* 文字颜色 */
        border-bottom-left-radius: 5px; /* 修改左下角圆角 */
        border-left: 3px solid var(--miku-teal); /* 左侧边框线，增加区分度 */
      }
    }
  }
  
  /* 聊天输入区域样式 */
  .chat-input {
    display: flex; /* 使用 Flexbox 布局 */
    margin-top: 20px; /* 顶部外边距 */
    
    /* 输入框样式 */
    input {
      flex: 1; /* 占据大部分水平空间 */
      padding: 12px 15px; /* 内边距 */
      border: 2px solid #ddd; /* 边框 */
      border-radius: 25px; /* 圆角 */
      outline: none; /* 移除聚焦时的默认轮廓 */
      font-size: 16px; /* 字体大小 */
      transition: border-color 0.3s; /* 边框颜色过渡效果 */
      
      /* 输入框聚焦时的样式 */
      &:focus {
        border-color: var(--miku-teal); /* 边框颜色变为主题色 */
      }
    }
    
    /* 发送按钮样式 */
    button {
      margin-left: 10px; /* 左侧外边距 */
      padding: 12px 25px; /* 内边距 */
      background-color: var(--miku-teal); /* 背景色 */
      color: white; /* 文字颜色 */
      border: none; /* 移除边框 */
      border-radius: 25px; /* 圆角 */
      cursor: pointer; /* 鼠标悬停时显示手型光标 */
      font-weight: bold; /* 字体加粗 */
      transition: background-color 0.3s; /* 背景色过渡效果 */
      
      /* 按钮悬停时的样式 */
      &:hover {
        // 使用 Sass 的 color.adjust 函数将背景色调暗 10%
        background-color: color.adjust(#39c5bb, $lightness: -10%);
      }
    }
  }
}
</style>