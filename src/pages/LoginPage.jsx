import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  if (rememberMe) {
    localStorage.setItem("rememberMe", "true");
  } else {
    localStorage.setItem("rememberMe", "false");
  }
  
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true); // Đánh dấu là "Ghi nhớ tôi" đã được chọn
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        const response = await axios.post('http://localhost:8080/auth/login', {
          emailOrPhone: email,
          password: password
        });

        // Kiểm tra nếu nhận được token từ API
        if (response.data.data.accessToken) {
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
          navigate("/"); // Điều hướng về trang chủ
          toast.success('Đăng nhập thành công!');
        } else {
          toast.error('Đăng nhập thất bại!');
        }
      } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        toast.error('Đăng nhập thất bại!');
      }
    } else {
      alert("Vui lòng nhập đầy đủ thông tin.");
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side */}
      <div className="w-1/2 bg-blue-600 text-white flex flex-col justify-center items-start px-16">
        <h1 className="text-5xl font-bold mb-4 flex items-center gap-2">
          <FaFacebook className="text-6xl" /> Facebook
        </h1>
        <p className="text-lg">
          Kết nối với bạn bè và thế giới xung quanh bạn trên Facebook.
        </p>
      </div>

      {/* Right side - Form login */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Đăng nhập tài khoản
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email hoặc số điện thoại</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={() => setRememberMe(!rememberMe)} 
                />
                Ghi nhớ tôi
              </label>
              <span className="text-blue-600 cursor-pointer hover:underline">
                Quên mật khẩu?
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Đăng nhập
            </button>

            {/* Nút đăng ký */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Chưa có tài khoản?</span>{" "}
              <span
                className="text-blue-600 font-medium hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Đăng ký ngay
              </span>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
