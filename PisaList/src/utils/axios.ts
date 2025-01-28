import axios from 'axios';
import { message } from 'antd';

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    console.log('Starting request to:', config.url);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Token from storage:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request headers:', config.headers);
    } else {
      console.log('No token found in storage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response) {
      const currentToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          console.log('401 error details:', {
            token: currentToken,
            headers: error.config?.headers,
            response: error.response?.data
          });
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          message.error(error.response.data.msg || '登录已过期，请重新登录');
          window.location.href = '/Login_Register';
          break;
        case 400:
          message.error(error.response.data.error || '请求参数错误');
          break;
        case 500:
          message.error('服务器错误，请稍后重试');
          break;
        default:
          message.error(error.response.data.msg || '操作失败，请重试');
      }
    } else {
      message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

export default instance; 