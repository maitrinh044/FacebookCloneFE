// utils/auth.js

export const checkLogin = () => {
    const token = localStorage.getItem("token");
    return !!token; // Trả về true nếu có token
  };
  