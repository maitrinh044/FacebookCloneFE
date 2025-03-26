import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import Messages from "../pages/MessagePage";
import EditProfilePage from "../pages/EditProfilePage";
import FriendsPage from "../pages/FriendsPage"; // Đã đổi tên từ FriendListPage
import AuthLayout from "../Layout/AuthLayout";
import MainLayout from "../Layout/MainLayout";

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
      
      {/* Friends Routes */}
      <Route path="/friends" element={<MainLayout><FriendsPage /></MainLayout>}>
        <Route index element={<AllFriends />} />
        <Route path="all" element={<AllFriends />} />
        <Route path="requests" element={<FriendRequests />} />
        <Route path="suggestions" element={<FriendSuggestions />} />
      </Route>
    </Routes>
  );
}