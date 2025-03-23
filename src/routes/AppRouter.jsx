// src/router/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import Messages from "../pages/MessagePage";
import EditProfilePage from "../pages/EditProfilePage";
import FriendListPage from "../pages/FriendListPage";
import AuthLayout from "../Layout/AuthLayout";
import MainLayout from "../Layout/MainLayout";
import Header from "../components/Header";

export default function AppRouter({ onOpenChat }) {
  return (
    <Routes>
      {/* Auth Routes - KHÔNG có Header */}
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

      {/* Main Routes - CÓ Header */}
      <Route path="/" element={<MainLayout><Home onOpenChat={onOpenChat} /></MainLayout>} />
      <Route path="/profile/:id" element={<MainLayout><ProfilePage /></MainLayout>} />
      <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
      <Route path="/profile/:userId/edit" element={<MainLayout><EditProfilePage /></MainLayout>} />
      <Route path="/friends" element={<MainLayout><FriendListPage /></MainLayout>} />
    </Routes>
  );
}
