import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import Messages from "../pages/MessagePage";
import EditProfilePage from "../pages/EditProfilePage";
import FriendListPage from "../components/FriendList/FriendListPage";
import FriendRequests from "../components/FriendList/FriendRequests";
import FriendSuggestions from "../components/FriendList/FriendSuggestions";
import AuthLayout from "../Layout/AuthLayout";
import MainLayout from "../Layout/MainLayout";
import GroupPage from "../pages/GroupPage";
import PrivateRoute from "./PrivateRoute";

export default function AppRouter({ onOpenChat }) {
  return (
    <Routes>
      {/* Auth Routes - KHÔNG có Header */}
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

      {/* Protected Routes - CÓ Header */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout><Home onOpenChat={onOpenChat} /></MainLayout>} />
        <Route path="/profile/:id" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
        <Route path="/profile/:userId/edit" element={<MainLayout><EditProfilePage /></MainLayout>} />

        {/* Friends */}
        <Route path="/friends" element={<MainLayout><FriendListPage /></MainLayout>} />
        <Route path="/friend-requests" element={<MainLayout><FriendRequests /></MainLayout>} />
        <Route path="/suggestions" element={<MainLayout><FriendSuggestions /></MainLayout>} />

        {/* Groups */}
        <Route path="/groups" element={<MainLayout><GroupPage /></MainLayout>} />
        <Route path="/groups/:id" element={<MainLayout><GroupPage /></MainLayout>} />
      </Route>
    </Routes>
  );
}