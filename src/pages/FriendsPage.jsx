import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/FriendList/Sidebar";
import AllFriends from "../components/FriendList/AllFriends";
import FriendRequests from "../components/FriendList/FriendRequests";
import FriendSuggestions from "../components/FriendList/FriendSuggestions";

export default function FriendsPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="all" element={<AllFriends />} />
          <Route path="requests" element={<FriendRequests />} />
          <Route path="suggestions" element={<FriendSuggestions />} />
          <Route path="*" element={<AllFriends />} />
        </Routes>
      </div>
    </div>
  );
}