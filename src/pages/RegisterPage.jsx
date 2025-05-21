
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [customGender, setCustomGender] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [errorMessage, setErrorMessage] = useState(""); // Trạng thái để lưu thông báo lỗi
  const navigate = useNavigate();

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12"
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const handleRegister = (e) => {
    e.preventDefault();

    let gd = null;
    switch(gender) {
      case 'Nam': gd = 'MALE'; break;
      case 'Nữ': gd = 'FEMALE'; break;
      case 'Tùy chỉnh': gd = 'UNDEFINED'; break;
      default: break;
    }

    const userData = {
      firstName,
      lastName,
      emailOrPhone: email,
      password,
      gender: gd,
      birthday: `${dob.year}-${dob.month}-${dob.day}`,
    };

    axiosClient
      .post('/auth/register', userData)
      .then((response) => {
        alert("Đăng ký thành công!"); 
        navigate("/login");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.data || "Đăng ký thất bại, vui lòng thử lại sau.");
        } else {
          setErrorMessage("Đăng ký thất bại, vui lòng thử lại sau.");
        }
        console.error("Đăng ký thất bại: ", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-blue-600 text-5xl font-bold mb-6">facebook</h1>

      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-1">Tạo tài khoản mới</h2>
        <p className="text-sm text-center text-gray-600 mb-4">Nhanh chóng và dễ dàng.</p>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Họ"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 border px-3 py-2 rounded-md text-sm"
            />
            <input
              type="text"
              placeholder="Tên"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 border px-3 py-2 rounded-md text-sm"
            />
          </div>

          <input
            placeholder="Số di động hoặc email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />

          <div>
            <label className="block text-sm text-gray-700 mb-1">Ngày sinh</label>
            <div className="flex gap-2">
              <select
                value={dob.day}
                onChange={(e) => setDob({ ...dob, day: e.target.value })}
                className="w-1/3 border px-3 py-2 rounded-md text-sm"
              >
                <option value="">Ngày</option>
                {days.map((d) => <option key={d}>{d}</option>)}
              </select>
              <select
                value={dob.month}
                onChange={(e) => setDob({ ...dob, month: e.target.value })}
                className="w-1/3 border px-3 py-2 rounded-md text-sm"
              >
                <option value="">Tháng</option>
                {months.map((m, i) => <option key={i + 1}>{m}</option>)}
              </select>
              <select
                value={dob.year}
                onChange={(e) => setDob({ ...dob, year: e.target.value })}
                className="w-1/3 border px-3 py-2 rounded-md text-sm"
              >
                <option value="">Năm</option>
                {years.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Giới tính</label>
            <div className="flex gap-2 justify-between text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  onChange={(e) => {
                    setGender(e.target.value);
                    setCustomGender("");
                  }}
                /> Nữ
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  onChange={(e) => {
                    setGender(e.target.value);
                    setCustomGender("");
                  }}
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
            {gender === "Tùy chỉnh" && (
              <input
                type="text"
                placeholder="Danh xưng (ví dụ: Anh, Chị...)"
                value={customGender}
                onChange={(e) => setCustomGender(e.target.value)}
                className="w-full border px-3 py-2 rounded-md text-sm mt-2"
              />
            )}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên Facebook.
          </p>
          <p className="text-xs text-gray-500">
            Bằng cách nhấp vào Đăng ký, bạn đồng ý với Điều khoản, Chính sách quyền riêng tư và Chính sách cookie của chúng tôi.
          </p>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md font-semibold text-lg mt-2"
          >
            Đăng ký
          </button>

          <p className="text-center mt-3 text-blue-600 text-sm hover:underline cursor-pointer"
             onClick={() => navigate("/login")}
          >
            Bạn đã có tài khoản ư?
          </p>
        </form>
      </div>
    </div>
  );
}