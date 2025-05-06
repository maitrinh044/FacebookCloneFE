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
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Kiểm tra lỗi 401 (Unauthorized) - Token hết hạn
      const refreshToken = localStorage.getItem('refreshToken');  // Lấy refreshToken từ localStorage
      console.log(refreshToken);
      if (refreshToken) {
        try {
          // Gửi yêu cầu làm mới token
          const refreshResponse = await axios.post('http://localhost:8080/auth/refresh-token', {
            refreshToken: yourToken
          });

          // Lưu lại accessToken mới vào localStorage
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          // Thử lại yêu cầu ban đầu với token mới
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosClient(error.config);
        } catch (refreshError) {
          // console.error('Lỗi làm mới token:', refreshError);
          // localStorage.removeItem('accessToken');
          // localStorage.removeItem('refreshToken');
          // window.location.href = "/login"; // hoặc dùng useNavigate nếu trong React component
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
