import React, { useEffect, useRef } from 'react';

const MessageList = ({ currentUserId, receiverId, messageList }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (messageList.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, [messageList]);

  return (
    <div className="h-[300px] bg-white shadow-md">
      <div className="overflow-y-auto h-full px-4 py-2">
        <div className="flex flex-col space-y-2">
          {messageList.map((msg, index) => (
            <div
              key={msg.id || `local-${index}`}
              className={`flex ${
                msg.senderId?.id == currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[70%] ${
                  msg.senderId?.id == currentUserId
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
