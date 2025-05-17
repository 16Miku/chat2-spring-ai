<template>
  <!-- 整体布局容器 -->
  <div class="chat-layout">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- 侧边栏头部 -->
      <div class="sidebar-header">
        <img src="/images/Miku7.jpg" alt="电商AI客服" class="avatar"> <!-- Avatar updated for context -->
        <h3 v-if="!sidebarCollapsed">电商AI客服</h3>
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
        <h2>与电商AI客服智能体的对话</h2>
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
          <img src="/images/Miku7.jpg" alt="电商AI客服" class="welcome-avatar"> <!-- Avatar updated for context -->
          <h3>你好！我是电商AI客服智能体</h3>
          <p>我可以解答您关于商品、订单、售后等问题。请问有什么可以帮您？</p>
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
              :src="msg.sender === 'assistant' ? '/images/Miku7.jpg' : '/images/user-avatar.png'" 
              :alt="msg.sender === 'assistant' ? '电商AI客服' : '用户'"
            >
          </div>
          
          <!-- 消息内容 -->
          <div class="message-content-wrapper">
            <div class="sender-name">{{ msg.sender === 'assistant' ? '电商AI客服' : '你' }}</div>
            <div class="message-content">
              {{ msg.content }}
            </div>
            <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
          </div>
        </div>
        
        <!-- 加载动画 -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-avatar">
            <img src="/images/Miku7.jpg" alt="电商AI客服"> <!-- Avatar updated for context -->
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
// import { getStreamChat, API_BASE_URL } from '@/services/api'; // Removed as per requirement

export default {
  data() {
    return {
      messages: [],
      inputMessage: '',
      // currentStreamResponse: '', // This might not be needed if we directly update message content
      isLoading: false,
      sidebarCollapsed: false,
      chatHistory: [
        { title: "售前咨询", messages: [] },
        { title: "订单问题", messages: [] },
        { title: "售后服务", messages: [] }
      ],
      currentChatIndex: 0,
      currentChatId: 1 // Default chatId, can be made dynamic later
    }
  },
  mounted() {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState) {
      this.sidebarCollapsed = JSON.parse(savedSidebarState);
    }
    
    this.$nextTick(() => {
      this.$refs.inputField.focus();
    });
  },
  methods: {
    async sendMessage(event) {
      if (event && event.type === 'keyup' && event.shiftKey) return;
      
      if (event && event.type === 'keyup') {
        event.preventDefault();
      }
      
      if (!this.inputMessage.trim() || this.isLoading) return;
      
      const userMessage = {
        sender: 'user',
        content: this.inputMessage,
        timestamp: new Date()
      };
      
      this.messages.push(userMessage);
      
      const currentInput = this.inputMessage;
      this.inputMessage = '';
      
      this.$nextTick(() => {
        this.$refs.inputField.style.height = 'auto';
      });
      
      this.isLoading = true;
      this.scrollToBottom(); // Scroll after user message and before AI response might be better UX
      
      try {
        const apiUrl = `http://localhost:10004/assistant/chat?chatId=${this.currentChatId}&message=${encodeURIComponent(currentInput)}`;
        
        const response = await fetch(apiUrl);
        
        this.isLoading = false;

        if (response.ok) {
          const assistantTextResponse = await response.text();
          this.messages.push({
            sender: 'assistant',
            content: assistantTextResponse,
            timestamp: new Date()
          });
        } else {
          console.error('Error from AI Assistant:', response.status, response.statusText);
          let errorMessage = '抱歉，AI客服暂时无法连接，请稍后再试。';
          try {
            const errorBody = await response.text();
            // You could try to parse errorBody if it's JSON and has a specific message format
            // For now, we'll use a generic message or the raw text if short.
            if (errorBody) {
                errorMessage = `AI客服错误: ${errorBody.substring(0,100)}`; // Show first 100 chars
            }
          } catch (e) {
            // ignore, use generic message
          }
          this.messages.push({
            sender: 'assistant',
            content: errorMessage,
            timestamp: new Date()
          });
        }
        
      } catch (error) {
        console.error('Error fetching AI Assistant response:', error);
        this.isLoading = false;
        this.messages.push({
          sender: 'assistant',
          content: '抱歉，连接AI客服时发生网络错误。',
          timestamp: new Date()
        });
      } finally {
        this.$forceUpdate(); // Ensure reactivity
        this.scrollToBottom();
      }
    },
    
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
    },
    
    startNewChat() {
      const newChat = {
        title: `新对话 ${this.chatHistory.length + 1}`, // Consider more relevant titles
        messages: []
      };
      this.chatHistory.unshift(newChat);
      this.currentChatIndex = 0;
      this.messages = [];
      // Potentially reset or assign a new chatId for new conversations if backend supports it
      // this.currentChatId = generateNewChatId(); 
      this.$nextTick(() => {
        this.$refs.inputField.focus();
      });
    },
    
    switchChat(index) {
      if (this.currentChatIndex !== index) {
        this.chatHistory[this.currentChatIndex].messages = [...this.messages];
        this.currentChatIndex = index;
        this.messages = [...this.chatHistory[index].messages];
        // Potentially update this.currentChatId if each history item has its own ID
        this.scrollToBottom();
      }
    },
    
    deleteChat(index) {
      if (confirm('确定要删除这个对话吗？')) {
        this.chatHistory.splice(index, 1);
        if (index === this.currentChatIndex) {
          if (this.chatHistory.length > 0) {
            this.currentChatIndex = 0;
            this.messages = [...this.chatHistory[0].messages];
          } else {
            this.startNewChat();
          }
        } else if (index < this.currentChatIndex) {
          this.currentChatIndex--;
        }
      }
    },
    
    clearMessages() {
      if (confirm('确定要清空当前对话吗？')) {
        this.messages = [];
        // Also clear it from history if needed
        if (this.chatHistory[this.currentChatIndex]) {
            this.chatHistory[this.currentChatIndex].messages = [];
        }
      }
    },
    
    autoResize() {
      const textarea = this.$refs.inputField;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
}
</script>

<style lang="scss">
// Styles are copied from ChatView.vue and should be identical
// Ensure @use "sass:color"; is present if you use color.adjust, etc.
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
      
      &.assistant { // Changed from .miku to .assistant
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