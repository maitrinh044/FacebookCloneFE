// src/router/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import Messages from "../pages/MessagePage";
import EditProfilePage from "../pages/EditProfilePage";
import FriendListPage from "../pages/FriendListPage";

export default function AppRouter({ onOpenChat }) {
  return (
    <Routes>
      <Route path="/" element={<Home onOpenChat={onOpenChat} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/profile/:userId/edit" element={<EditProfilePage />} />
      <Route path="/friends" element={<FriendListPage />} />

    </Routes>
  );
}