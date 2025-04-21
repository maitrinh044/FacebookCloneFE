import React from "react";

const ReactionPopup = ({ reactions, onSelect }) => {
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