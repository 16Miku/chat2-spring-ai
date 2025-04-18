<template>
  <!-- 整体布局容器 -->
  <div class="chat-layout">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- 侧边栏头部 -->
      <div class="sidebar-header">
        <img src="/images/Miku7.jpg" alt="初音未来" class="avatar">
        <h3 v-if="!sidebarCollapsed">初音未来 AI</h3>
        <button class="collapse-btn" @click="toggleSidebar">
          <i class="fas" :class="sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </button>
      </div>
      
      <!-- 新建对话按钮 -->
      <div class="new-chat-btn" v-if="!sidebarCollapsed" @click="startNewChat">
        <i class="fas fa-plus"></i> 新建对话
      </div>
      
      <!-- 对话历史列表 -->
      <div class="chat-history" v-if="!sidebarCollapsed">
        <div 
          v-for="(chat, index) in chatHistory" 
          :key="index" 
          class="history-item"
          :class="{ 'active': currentChatIndex === index }"
          @click="switchChat(index)"
        >
          <i class="fas fa-comment"></i>
          <span class="history-title">{{ chat.title }}</span>
          <i class="fas fa-trash delete-icon" @click.stop="deleteChat(index)"></i>
        </div>
      </div>
      
      <!-- 侧边栏底部 -->
      <div class="sidebar-footer" v-if="!sidebarCollapsed">
        <router-link to="/" class="home-link">
          <i class="fas fa-home"></i> 返回首页
        </router-link>
      </div>
    </div>
    
    <!-- 主聊天区域 -->
    <div class="main-chat-area">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <h2>与初音未来的对话</h2>
        <div class="header-actions">
          <button class="action-btn" @click="startNewChat" title="新建对话">
            <i class="fas fa-plus"></i>
          </button>
          <button class="action-btn" @click="clearMessages" title="清空对话">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <!-- 聊天消息区域 -->
      <div class="chat-messages" ref="messagesContainer">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 0" class="welcome-container">
          <img src="/images/Miku7.jpg" alt="初音未来" class="welcome-avatar">
          <h3>你好！我是初音未来 AI 助手</h3>
          <p>我可以回答问题、提供信息或者陪你聊天。请告诉我你想了解什么？</p>
        </div>
        
        <!-- 消息列表 -->
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          :class="['message-container', msg.sender]"
        >
          <!-- 发送者头像 -->
          <div class="sender-avatar">
            <img 
              :src="msg.sender === 'miku' ? '/images/Miku7.jpg' : '/images/user-avatar.png'" 
              :alt="msg.sender === 'miku' ? '初音未来' : '用户'"
            >
          </div>
          
          <!-- 消息内容 -->
          <div class="message-content-wrapper">
            <div class="sender-name">{{ msg.sender === 'miku' ? '初音未来' : '你' }}</div>
            <div class="message-content">
              {{ msg.content }}
            </div>
            <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
          </div>
        </div>
        
        <!-- 加载动画 -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-avatar">
            <img src="/images/Miku7.jpg" alt="初音未来">
          </div>
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      
      <!-- 聊天输入区域 -->
      <div class="chat-input-container">
        <div class="input-wrapper">
          <textarea 
            v-model="inputMessage" 
            @keyup.enter.exact="sendMessage" 
            placeholder="输入消息，按Enter发送..." 
            :disabled="isLoading"
            ref="inputField"
            rows="1"
            @input="autoResize"
          ></textarea>
          <button 
            class="send-btn" 
            @click="sendMessage" 
            :disabled="!inputMessage.trim() || isLoading"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div class="input-footer">
          <span class="input-tip">按 Enter 发送，Shift + Enter 换行</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStreamChat, API_BASE_URL } from '@/services/api'

export default {
  data() {
    return {
      messages: [],
      inputMessage: '',
      currentStreamResponse: '',
      isLoading: false,
      sidebarCollapsed: false,
      chatHistory: [
        { title: "关于初音未来的问题", messages: [] },
        { title: "音乐创作讨论", messages: [] },
        { title: "Vocaloid技术探讨", messages: [] }
      ],
      currentChatIndex: 0
    }
  },
  mounted() {
    // 检查是否有保存的侧边栏状态
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState) {
      this.sidebarCollapsed = JSON.parse(savedSidebarState);
    }
    
    // 自动聚焦输入框
    this.$nextTick(() => {
      this.$refs.inputField.focus();
    });
  },
  methods: {
    async sendMessage(event) {
      // 如果是按Enter键且同时按了Shift键，不发送消息（用于换行）
      if (event && event.type === 'keyup' && event.shiftKey) return;
      
      // 阻止Enter键的默认行为
      if (event && event.type === 'keyup') {
        event.preventDefault();
      }
      
      if (!this.inputMessage.trim() || this.isLoading) return;
      
      // 创建用户消息对象
      const userMessage = {
        sender: 'user',
        content: this.inputMessage,
        timestamp: new Date()
      };
      
      // 将用户消息添加到当前对话
      this.messages.push(userMessage);
      
      // 保存当前输入并清空输入框
      const currentInput = this.inputMessage;
      this.inputMessage = '';
      
      // 重置输入框高度
      this.$nextTick(() => {
        this.$refs.inputField.style.height = 'auto';
      });
      
      // 设置加载状态
      this.isLoading = true;
      
      try {
        // 创建EventSource连接
        const eventSource = new EventSource(`${API_BASE_URL}/stream-chat?input=${encodeURIComponent(currentInput)}`);
        
        // 准备接收消息
        let mikuResponse = '';
        
        // 监听消息事件
        eventSource.onmessage = (event) => {
          mikuResponse += event.data;
          
          // 如果这是第一个消息片段，创建Miku消息对象
          if (this.isLoading && mikuResponse.length > 0) {
            this.isLoading = false;
            this.messages.push({
              sender: 'miku',
              content: mikuResponse,
              timestamp: new Date()
            });
          } else {
            // 更新最后一条消息的内容
            this.messages[this.messages.length - 1].content = mikuResponse;
          }
          
          // 强制更新视图
          this.$forceUpdate();
          
          // 滚动到底部
          this.scrollToBottom();
        };
        
        // 监听错误
        eventSource.onerror = (error) => {
          console.error('SSE Error:', error);
          this.isLoading = false;
          
          // 如果还没有创建Miku消息，创建一个错误消息
          if (mikuResponse === '') {
            this.messages.push({
              sender: 'miku',
              content: '抱歉，我遇到了一些问题，无法回应你的消息。',
              timestamp: new Date()
            });
          }
          
          // 关闭连接
          eventSource.close();
          this.$forceUpdate();
          this.scrollToBottom();
        };
        
        // 连接打开事件
        eventSource.onopen = () => {
          console.log("SSE Connection opened.");
        };
        
      } catch (error) {
        console.error('Error initiating SSE:', error);
        this.isLoading = false;
        this.messages.push({
          sender: 'miku',
          content: '抱歉，我遇到了一些问题，无法回应你的消息。',
          timestamp: new Date()
        });
        this.$forceUpdate();
        this.scrollToBottom();
      }
    },
    
    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${hours}:${minutes}`;
    },
    
    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    
    // 切换侧边栏
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      // 保存状态到本地存储
      localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
    },
    
    // 开始新对话
    startNewChat() {
      // 创建新的对话
      const newChat = {
        title: `新对话 ${this.chatHistory.length + 1}`,
        messages: []
      };
      
      this.chatHistory.unshift(newChat);
      this.currentChatIndex = 0;
      this.messages = [];
      
      // 聚焦输入框
      this.$nextTick(() => {
        this.$refs.inputField.focus();
      });
    },
    
    // 切换到指定对话
    switchChat(index) {
      // 保存当前对话的消息
      if (this.currentChatIndex !== index) {
        this.chatHistory[this.currentChatIndex].messages = [...this.messages];
        this.currentChatIndex = index;
        this.messages = [...this.chatHistory[index].messages];
        this.scrollToBottom();
      }
    },
    
    // 删除对话
    deleteChat(index) {
      if (confirm('确定要删除这个对话吗？')) {
        this.chatHistory.splice(index, 1);
        
        // 如果删除的是当前对话
        if (index === this.currentChatIndex) {
          // 如果还有其他对话，切换到第一个
          if (this.chatHistory.length > 0) {
            this.currentChatIndex = 0;
            this.messages = [...this.chatHistory[0].messages];
          } else {
            // 如果没有其他对话，创建一个新的
            this.startNewChat();
          }
        } else if (index < this.currentChatIndex) {
          // 如果删除的是当前对话之前的对话，调整索引
          this.currentChatIndex--;
        }
      }
    },
    
    // 清空当前对话
    clearMessages() {
      if (confirm('确定要清空当前对话吗？')) {
        this.messages = [];
      }
    },
    
    // 自动调整输入框高度
    autoResize() {
      const textarea = this.$refs.inputField;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
}
</script>

<style lang="scss">
@use "sass:color";

/* 整体布局 */
.chat-layout {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
}

/* 侧边栏样式 */
.sidebar {
  width: 280px;
  background-color: #2d2d2d;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  
  &.sidebar-collapsed {
    width: 60px;
  }
  
  .sidebar-header {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    h3 {
      margin: 0 0 0 10px;
      font-size: 16px;
      flex: 1;
    }
    
    .collapse-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 5px;
      
      &:hover {
        color: #39c5bb;
      }
    }
  }
  
  .new-chat-btn {
    margin: 15px;
    padding: 10px;
    background-color: #39c5bb;
    color: white;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: color.adjust(#39c5bb, $lightness: -10%);
    }
    
    i {
      margin-right: 5px;
    }
  }
  
  .chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    
    .history-item {
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      position: relative;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        
        .delete-icon {
          opacity: 1;
        }
      }
      
      &.active {
        background-color: rgba(57, 197, 187, 0.2);
        border-left: 3px solid #39c5bb;
      }
      
      i {
        margin-right: 10px;
        color: #39c5bb;
      }
      
      .history-title {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .delete-icon {
        opacity: 0;
        transition: opacity 0.3s;
        color: #ff6b6b;
        
        &:hover {
          color: #ff4040;
        }
      }
    }
  }
  
  .sidebar-footer {
    padding: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    
    .home-link {
      display: block;
      color: white;
      text-decoration: none;
      padding: 10px;
      border-radius: 5px;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      i {
        margin-right: 5px;
        color: #39c5bb;
      }
    }
  }
}

/* 主聊天区域 */
.main-chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    
    h2 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }
    
    .header-actions {
      display: flex;
      gap: 10px;
      
      .action-btn {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 4px;
        transition: all 0.3s;
        
        &:hover {
          background-color: #f0f0f0;
          color: #39c5bb;
        }
      }
    }
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    /* 欢迎消息 */
    .welcome-container {
      text-align: center;
      margin: auto 0;
      padding: 30px;
      
      .welcome-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 20px;
        border: 3px solid #39c5bb;
      }
      
      h3 {
        color: #333;
        margin-bottom: 10px;
      }
      
      p {
        color: #666;
        max-width: 500px;
        margin: 0 auto;
      }
    }
    
    /* 消息容器 */
    .message-container {
      display: flex;
      gap: 15px;
      max-width: 85%;
      
      &.user {
        align-self: flex-end;
        flex-direction: row-reverse;
        
        .message-content {
          background-color: #39c5bb;
          color: white;
          border-radius: 18px 18px 4px 18px;
        }
        
        .sender-name {
          text-align: right;
        }
        
        .message-time {
          text-align: right;
        }
      }
      
      &.miku {
        align-self: flex-start;
        
        .message-content {
          background-color: #f0f0f0;
          color: #333;
          border-radius: 18px 18px 18px 4px;
        }
      }
      
      .sender-avatar {
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      
      .message-content-wrapper {
        flex: 1;
        
        .sender-name {
          font-size: 12px;
          color: #888;
          margin-bottom: 5px;
        }
        
        .message-content {
          padding: 12px 16px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .message-time {
          font-size: 11px;
          color: #aaa;
          margin-top: 5px;
        }
      }
    }
    
    /* 加载动画 */
    .loading-container {
      display: flex;
      align-items: center;
      gap: 15px;
      align-self: flex-start;
      
      .loading-avatar {
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      
      .loading-dots {
        display: flex;
        gap: 5px;
        padding: 15px;
        background-color: #f0f0f0;
        border-radius: 18px;
        
        span {
          width: 8px;
          height: 8px;
          background-color: #aaa;
          border-radius: 50%;
          animation: loading-dot 1.4s infinite ease-in-out both;
          
          &:nth-child(1) {
            animation-delay: -0.32s;
          }
          
          &:nth-child(2) {
            animation-delay: -0.16s;
          }
        }
      }
    }
  }
  
  /* 输入区域 */
  .chat-input-container {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    
    .input-wrapper {
      display: flex;
      align-items: flex-end;
      background-color: #f5f5f5;
      border-radius: 20px;
      padding: 10px 15px;
      
      textarea {
        flex: 1;
        border: none;
        background: none;
        resize: none;
        outline: none;
        max-height: 150px;
        font-size: 15px;
        line-height: 1.5;
        padding: 0;
        font-family: inherit;
      }
      
      .send-btn {
        background-color: #39c5bb;
        color: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-left: 10px;
        
        &:hover {
          background-color: color.adjust(#39c5bb, $lightness: -10%);
        }
        
        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      }
    }
    
    .input-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 5px;
      
      .input-tip {
        font-size: 12px;
        color: #aaa;
      }
    }
  }
}

/* 加载动画关键帧 */
@keyframes loading-dot {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar:not(.sidebar-collapsed) {
    position: absolute;
    z-index: 10;
    height: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  
  .message-container {
    max-width: 95% !important;
  }
}
</style>