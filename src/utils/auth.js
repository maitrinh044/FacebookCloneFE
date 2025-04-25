import axios from "axios";
import { toast } from "react-toastify";

// Hàm xử lý đăng nhập
export const login = async (email, password, rememberMe, connect) => {
    try {
        const response = await axios.post("http://localhost:8080/auth/login", {
            emailOrPhone: email,
            password: password,
        });

        // Kiểm tra nếu nhận được token từ API
        if (response.data.data.accessToken) {
            connect(response.data.data.userId);
            // Lưu thông tin vào localStorage nếu "Ghi nhớ tôi" được chọn
            if (rememberMe) {
                localStorage.setItem("email", email);
                localStorage.setItem("password", password); // Lưu mật khẩu
            } else {
                localStorage.removeItem("email");
                localStorage.removeItem("password"); // Xóa nếu không chọn ghi nhớ
            }

            // Lưu token vào localStorage
            localStorage.setItem("accessToken", response.data.data.accessToken);
            localStorage.setItem("refreshToken", response.data.data.refreshToken);
            localStorage.setItem("userId", response.data.data.userId);

            return true;
        } else {
            toast.error("Đăng nhập thất bại!");
            return false;
        }
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        toast.error("Đăng nhập thất bại!");
        return false;
    }
};

export const handleLogout = async (disconnect, navigate) => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            await axios.post('http://localhost:8080/auth/logout', JSON.stringify(refreshToken), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const userId = localStorage.getItem("userId");

            disconnect(userId);
            
            const rememberMe = localStorage.getItem("rememberMe");

            // Xóa token khỏi localStorage
            if (rememberMe) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userId");
            } else {
                localStorage.removeItem("userId");
                localStorage.removeItem("email");
                localStorage.removeItem("password");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }

            toast.success('Đăng xuất thành công!');
            navigate("/login"); // Redirect to login page after logout
        } else {
            toast.error('Không tìm thấy refreshToken');
        }
    } catch (error) {
        console.error('Logout failed', error);
        toast.error('Lỗi khi đăng xuất!');
    }
};