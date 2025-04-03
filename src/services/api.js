import axios from 'axios';

export const API_BASE_URL = 'http://localhost:10001'; // 导出API基础URL

// 基本聊天请求 - 使用GET方法
export const sendMessageToAI = async (message) => {
  return axios.get(`${API_BASE_URL}/chat`, {
    params: { input: message }
  });
};

// 获取结构化响应
export const getResponseFromAI = async (message) => {
  return axios.get(`${API_BASE_URL}/response`, {
    params: { input: message }
  });
};

// 获取歌手歌曲信息
export const getSingerSongs = async (singerName) => {
  return axios.get(`${API_BASE_URL}/singer-songs`, {
    params: { name: singerName }
  });
};

// 流式聊天响应 - 返回文本流
// 流式聊天响应 - 作为默认的对话方式
export const getStreamChat = async (message, callback) => {
  return axios.get(`${API_BASE_URL}/stream-chat`, {
    params: { input: message },
    responseType: 'text',
    onDownloadProgress: progressEvent => {
      const responseText = progressEvent.currentTarget.response;
      if (callback && typeof callback === 'function') {
        callback(responseText);
      }
    }
  });
};

// 流式聊天响应 - 返回结构化数据流
export const getStreamChatResponse = async (message) => {
  return axios.get(`${API_BASE_URL}/stream-chat-response`, {
    params: { input: message },
    responseType: 'stream'
  });
};