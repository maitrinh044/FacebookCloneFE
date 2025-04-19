import React, { useEffect, useRef, useState } from 'react';
import { getMessageList } from '../../services/MessageService';

const MessageList = ({ currentUserId, receiverId, localMessages = [] }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessageList(currentUserId, receiverId);
        setMessages(data);
      } catch (error) {
        console.error('Lỗi khi load danh sách tin nhắn:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId && receiverId) {
      fetchMessages();
    }
  }, [currentUserId, receiverId]);
  console.log("messages: ", messages);
  useEffect(() => {
    // Khi localMessages thay đổi, cập nhật lại danh sách tin nhắn
    if (localMessages.length > 0) {
      setMessages(prevMessages => [...prevMessages, ...localMessages]);
    }
  }, [localMessages]);  // Khi localMessages thay đổi, cập nhật tin nhắn mới

  useEffect(() => {
    // Đảm bảo scroll sau khi toàn bộ content đã render
    if (messages.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, [messages]);  // Mỗi khi messages thay đổi (gồm cả localMessages)

  if (loading) return <div>Đang tải tin nhắn...</div>;

  return (
    <div className="h-[300px] bg-white shadow-md">
      <div
        className="overflow-y-auto h-full px-4 py-2"
        ref={scrollContainerRef}
      >
        <div className="flex flex-col space-y-2">
          {[...messages, ...localMessages].map((msg, index) => (
            <div
              key={msg.id || `local-${index}`}
              className={`flex ${
                msg.senderId?.id === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[70%] ${
                  msg.senderId?.id === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {msg.content}
                <div className="text-xs text-gray-500 text-right mt-1">
                  {new Date(msg.sendAt || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

export default MessageList;
