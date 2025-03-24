// src/components/ReactionPopup.jsx
import React from "react";

const reactions = [
  { id: "like", emoji: "👍", label: "Thích" },
  { id: "love", emoji: "❤️", label: "Yêu thích" },
  { id: "haha", emoji: "😆", label: "Haha" },
  { id: "wow", emoji: "😮", label: "Wow" },
  { id: "sad", emoji: "😢", label: "Buồn" },
  { id: "angry", emoji: "😡", label: "Phẫn nộ" },
];

const ReactionPopup = ({ onSelect }) => {
  return (
    <div className="absolute bottom-4 left-0 bg-white border shadow-md rounded-full px-3 py-2 flex gap-2 z-50">
      {reactions.map((reaction) => (
        <button
          key={reaction.id}
          className="text-2xl hover:scale-125 transition-transform"
          onClick={() => onSelect(reaction)}
          title={reaction.label}
        >
          {reaction.emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionPopup;
