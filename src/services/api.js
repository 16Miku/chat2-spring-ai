// 导入 axios 库，用于发送 HTTP 请求
import axios from 'axios';

// 定义并导出后端 API 的基础 URL
// 所有 API 请求都将基于这个地址
export const API_BASE_URL = 'http://localhost:10001'; // 你的 Spring AI 后端服务地址

/**
 * 发送基本的聊天消息到后端 /chat 端点
 * @param {string} message - 用户输入的消息内容
 * @returns {Promise<axios.AxiosResponse<any>>} - 返回一个 Promise，包含 axios 的响应对象
 */
export const sendMessageToAI = async (message) => {
  // 使用 axios 发送 GET 请求
  return axios.get(`${API_BASE_URL}/chat`, {
    // 将用户消息作为查询参数 'input' 发送
    params: { input: message }
  });
};

/**
 * 请求后端的 /response 端点以获取结构化的响应
 * @param {string} message - 用户输入的消息内容
 * @returns {Promise<axios.AxiosResponse<any>>} - 返回一个 Promise，包含 axios 的响应对象
 */
export const getResponseFromAI = async (message) => {
  // 使用 axios 发送 GET 请求
  return axios.get(`${API_BASE_URL}/response`, {
    // 将用户消息作为查询参数 'input' 发送
    params: { input: message }
  });
};

/**
 * 请求后端的 /singer-songs 端点以获取特定歌手的歌曲信息
 * @param {string} singerName - 歌手的名字
 * @returns {Promise<axios.AxiosResponse<any>>} - 返回一个 Promise，包含 axios 的响应对象
 */
export const getSingerSongs = async (singerName) => {
  // 使用 axios 发送 GET 请求
  return axios.get(`${API_BASE_URL}/singer-songs`, {
    // 将歌手名字作为查询参数 'name' 发送
    params: { name: singerName }
  });
};

/**
 * 尝试使用 axios 处理流式聊天响应 (文本流)
 * 注意：这种方式可能不适用于标准的 Server-Sent Events (SSE)，
 * 在 ChatView.vue 中已改用 EventSource API 处理 SSE。
 * @param {string} message - 用户输入的消息内容
 * @param {function(string): void} callback - 用于处理接收到的文本片段的回调函数
 * @returns {Promise<axios.AxiosResponse<any>>} - 返回一个 Promise，包含 axios 的响应对象
 */
export const getStreamChat = async (message, callback) => {
  // 使用 axios 发送 GET 请求
  return axios.get(`${API_BASE_URL}/stream-chat`, {
    // 将用户消息作为查询参数 'input' 发送
    params: { input: message },
    // 指定响应类型为文本
    responseType: 'text',
    // 监听下载进度事件，尝试在数据块到达时处理
    onDownloadProgress: progressEvent => {
      // 获取当前已接收到的完整响应文本
      const responseText = progressEvent.currentTarget.response;
      // 如果提供了回调函数，则调用它并传递响应文本
      if (callback && typeof callback === 'function') {
        // 注意：这里传递的是累积的完整文本，而不是增量片段
        callback(responseText);
      }
    }
  });
};

/**
 * 尝试使用 axios 处理流式聊天响应 (结构化数据流)
 * 注意：responseType: 'stream' 主要用于 Node.js 环境处理二进制流，
 * 在浏览器中处理流式响应（如 SSE）通常使用 EventSource 或 Fetch API。
 * @param {string} message - 用户输入的消息内容
 * @returns {Promise<axios.AxiosResponse<any>>} - 返回一个 Promise，包含 axios 的响应对象
 */
export const getStreamChatResponse = async (message) => {
  // 使用 axios 发送 GET 请求
  return axios.get(`${API_BASE_URL}/stream-chat-response`, {
    // 将用户消息作为查询参数 'input' 发送
    params: { input: message },
    // 指定响应类型为流 (在浏览器中行为可能不符合预期)
    responseType: 'stream'
  });
};