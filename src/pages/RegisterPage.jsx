import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const navigate = useNavigate();

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !gender) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    alert("Đăng ký thành công!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-1">Tạo tài khoản mới</h2>
        <p className="text-sm text-center text-gray-600 mb-4">Nhanh chóng và dễ dàng.</p>

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Họ"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 border px-3 py-2 rounded-md text-sm"
              required
            />
            <input
              type="text"
              placeholder="Tên"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 border px-3 py-2 rounded-md text-sm"
              required
            />
          </div>

          <div className="flex gap-2">
            <select
              value={dob.day}
              onChange={(e) => setDob({ ...dob, day: e.target.value })}
              className="w-1/3 border px-3 py-2 rounded-md text-sm"
              required
            >
              <option value="">Ngày sinh</option>
              {days.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              value={dob.month}
              onChange={(e) => setDob({ ...dob, month: e.target.value })}
              className="w-1/3 border px-3 py-2 rounded-md text-sm"
              required
            >
              <option value="">Tháng</option>
              {months.map((m, i) => (
                <option key={i + 1} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={dob.year}
              onChange={(e) => setDob({ ...dob, year: e.target.value })}
              className="w-1/3 border px-3 py-2 rounded-md text-sm"
              required
            >
              <option value="">Năm</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-between text-sm">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="Nữ"
                onChange={(e) => setGender(e.target.value)}
              /> Nữ
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="Nam"
                onChange={(e) => setGender(e.target.value)}
              /> Nam
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="Tùy chỉnh"
                onChange={(e) => setGender(e.target.value)}
              /> Tùy chỉnh
            </label>
          </div>

          <input
            type="email"
            placeholder="Số di động hoặc email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border px-3 py-2 rounded-md text-sm ${!email && 'border-red-500'}`}
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full border px-3 py-2 rounded-md text-sm ${!password && 'border-red-500'}`}
            required
          />

          <p className="text-xs text-gray-500 mt-1">
            Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên Facebook.
          </p>
          <p className="text-xs text-gray-500">
            Bằng cách nhấp vào Đăng ký, bạn đồng ý với Điều khoản, Chính sách quyền riêng tư và Chính sách cookie của chúng tôi.
          </p>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md font-semibold mt-2"
          >
            Đăng ký
          </button>

          <p className="text-center mt-2 text-blue-600 text-sm hover:underline cursor-pointer"
             onClick={() => navigate("/login")}
          >
            Bạn đã có tài khoản ư?
          </p>
        </form>
      </div>
    </div>
  );
}
