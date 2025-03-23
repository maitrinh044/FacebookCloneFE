import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Giả lập xử lý login (thay bằng gọi API thật sau này)
    if (email && password) {
      localStorage.setItem("token", "fake_token");
      navigate("/");
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
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
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
                <input type="checkbox" />
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
