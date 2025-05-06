// utils/axiosClient.js
import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080', // Base URL của API
});

// Thêm interceptor để tự động thêm Authorization header vào tất cả các yêu cầu
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Lấy accessToken từ localStorage
    const isPublicAPI = config.url.includes("/auth/register") || config.url.includes("/auth/login");

    if (token && !isPublicAPI) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Không xử lý lại nếu lỗi không phải 401 hoặc đã xử lý 1 lần rồi
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes('/auth/refresh-token')) {
        // Không can thiệp vào chính request refresh-token
        return Promise.reject(error);
      }

      originalRequest._retry = true; // Đánh dấu là đã retry 1 lần

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post('http://localhost:8080/auth/refresh-token', {
            refreshToken: refreshToken
          });

          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          // Gắn token mới vào header và gửi lại request cũ
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Làm mới token thất bại => clear localStorage và logout
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);


export default axiosClient;
