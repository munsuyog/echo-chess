import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api.config';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token to headers
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (import.meta.env.NODE_ENV === 'development') {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    const duration = startTime ? endTime.getTime() - startTime.getTime() : 0;

    // Log response in development
    if (import.meta.env.NODE_ENV === 'development') {
      console.log(
        '📥 Response:',
        response.config.method?.toUpperCase(),
        response.config.url,
        `(${duration}ms)`,
        response.status
      );
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      console.error('❌ Response Error:', status, data);

      switch (status) {
        case 401:
          // Unauthorized - handled by auth interceptor
          console.log('🔒 Unauthorized access');
          break;
        case 403:
          console.log('🚫 Forbidden access');
          break;
        case 404:
          console.log('🔍 Resource not found');
          break;
        case 500:
          console.log('💥 Server error');
          break;
        default:
          console.log('⚠️ Error:', status);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('📡 Network Error:', error.message);
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Type augmentation for custom metadata
declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

export default axiosInstance;