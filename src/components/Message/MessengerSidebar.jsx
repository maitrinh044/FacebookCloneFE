export default function MessengerSidebar({ conversations, onSelect }) {
    return (
      <div className="w-1/3 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Tin nhắn</h2>
        <ul className="space-y-2">
          {conversations.map((c, index) => (
            <li
              key={index}
              onClick={() => onSelect(c)}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-500 truncate">{c.lastMessage}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  