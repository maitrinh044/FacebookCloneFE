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

// Thêm interceptor để xử lý khi token hết hạn và làm mới token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Không cố gắng refresh nếu lỗi đến từ chính refresh-token hoặc đã retry 1 lần
    const isRefreshURL = originalRequest.url.includes("/auth/refresh-token");
    if (error.response?.status === 401 && !isRefreshURL && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post('http://localhost:8080/auth/refresh-token', {
            refreshToken,
          });

          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          // Cập nhật header và thử lại request ban đầu
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          console.error('Lỗi làm mới token:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);


export default axiosClient;
