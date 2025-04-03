<template>
  <div class="miku-chat-container">
    <div class="chat-header">
      <img src="@/assets/miku-avatar.png" alt="初音未来" class="avatar">
      <h2>初音未来 AI 助手</h2>
    </div>
    
    <div class="chat-messages">
      <div v-for="(msg, index) in messages" :key="index" 
           :class="['message', msg.sender]">
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>
    
    <div class="chat-input">
      <input v-model="inputMessage" @keyup.enter="sendMessage" 
             placeholder="和初音未来聊天...">
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
// 导入getStreamChat而不是sendMessageToAI
import { getStreamChat, API_BASE_URL } from '@/services/api'

export default {
  data() {
    return {
      messages: [],
      inputMessage: '',
      // 添加一个变量来存储当前正在接收的消息
      currentStreamResponse: ''
    }
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim()) return;
      
      const userMessage = {
        sender: 'user',
        content: this.inputMessage
      };
      this.messages.push(userMessage);
      
      // 创建一个初始的空回复消息
      const mikuMessage = {
        sender: 'miku',
        content: ''
      };
      this.messages.push(mikuMessage);
      
      try {
        // 使用流式API并提供回调函数
        const eventSource = new EventSource(`${API_BASE_URL}/stream-chat?input=${encodeURIComponent(this.inputMessage)}`);
        
        eventSource.onmessage = (event) => {
          // 更新最后一条消息的内容
          mikuMessage.content += event.data; // 累加接收到的文本
          this.$forceUpdate(); // 强制Vue更新视图
        };
        
        eventSource.onerror = (error) => {
          console.error('Error:', error);
          mikuMessage.content = '抱歉，我遇到了一些问题，无法回应你的消息。';
          eventSource.close();
        };
        
      } catch (error) {
        console.error('Error:', error);
        mikuMessage.content = '抱歉，我遇到了一些问题，无法回应你的消息。';
      }
      
      this.inputMessage = '';
    }
  }
}
</script>

<style lang="scss">
@use "sass:color";

.miku-chat-container {
  /* 初音未来主题配色 */
  --miku-teal: #39c5bb;
  --miku-dark: #2d2d2d;
  
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  
  .chat-header {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 2px solid var(--miku-teal);
    margin-bottom: 20px;
    
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 15px;
      border: 2px solid var(--miku-teal);
    }
    
    h2 {
      color: var(--miku-teal);
      margin: 0;
    }
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    
    .message {
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 18px;
      position: relative;
      
      &.user {
        align-self: flex-end;
        background-color: var(--miku-teal);
        color: white;
        border-bottom-right-radius: 5px;
      }
      
      &.miku {
        align-self: flex-start;
        background-color: white;
        color: var(--miku-dark);
        border-bottom-left-radius: 5px;
        border-left: 3px solid var(--miku-teal);
      }
    }
  }
  
  .chat-input {
    display: flex;
    margin-top: 20px;
    
    input {
      flex: 1;
      padding: 12px 15px;
      border: 2px solid #ddd;
      border-radius: 25px;
      outline: none;
      font-size: 16px;
      transition: border-color 0.3s;
      
      &:focus {
        border-color: var(--miku-teal);
      }
    }
    
    button {
      margin-left: 10px;
      padding: 12px 25px;
      background-color: var(--miku-teal);
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s;
      
      &:hover {
        // 修改这一行，使用推荐的color.adjust替代darken
        background-color: color.adjust(#39c5bb, $lightness: -10%);
      }
    }
  }
}
</style>