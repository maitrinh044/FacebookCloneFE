// src/components/SendMessageForm.jsx
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { getLocalISOStringWithoutMs } from "../../utils/dateUtil";

const SendMessageForm = ({ onSend, senderId, receiverId, inputRef }) => {
    const [inputText, setInputText] = useState("");
  
    const handleSend = () => {
      const trimmedText = inputText.trim();
      if (!senderId || !receiverId) {
        console.error("Sender hoặc receiver chưa có ID");
        return;
      }
  
      if (trimmedText !== "") {
        const messageObj = {
          senderId: { id: senderId },
          receiverId: { id: receiverId },
          content: trimmedText,
          type: "TEXT",
          sendAt: getLocalISOStringWithoutMs(),
        };
        onSend(messageObj);
        setInputText("");
      }
    };
  
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault(); // ngăn xuống dòng
          handleSend();
        }
      };
      
  
    return (
      <div className="p-3 border-t flex items-center gap-2 bg-white">
        <input
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none"
            placeholder="Nhập tin nhắn..."
            />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
        >
          <FaPaperPlane size={16} />
        </button>
      </div>
    );
};
  

export default SendMessageForm;
  