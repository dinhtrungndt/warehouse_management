import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:1811/api', // Trỏ đến backend API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý response chung nếu cần
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi tập trung
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
