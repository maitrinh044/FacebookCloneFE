import { useState, useEffect } from "react";
import { getMessageList } from "../services/MessageService";

export function useFetchMessages(currentUserId, friendId) {
    const [messageList, setMessageList] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await getMessageList(currentUserId, friendId);
        setMessageList(response);  // Đảm bảo dữ liệu có trả về từ API
        return response; // Trả về dữ liệu để sử dụng trong refetch
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
        return []; // Hoặc trả về mảng rỗng nếu có lỗi
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (currentUserId && friendId) {
        fetchMessages();
      }
    }, [currentUserId, friendId]);
  
    return {
      messageList,
      loading,
      refetch: fetchMessages, // Trả về hàm fetchMessages để có thể gọi lại
    };
}
  
