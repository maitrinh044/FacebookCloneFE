// src/components/FriendList.jsx
export default function FriendList({ onOpenChat }) {
    const friends = [
      { id: 1, name: "An Nguyễn" },
      { id: 2, name: "Bảo Trân" },
      { id: 3, name: "Hoàng Minh" },
    ];
  
    return (
      <div className="fixed bottom-4 left-4 bg-white border shadow rounded-lg p-3 w-60">
        <h3 className="font-bold mb-2">Bạn bè</h3>
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="cursor-pointer hover:text-blue-600"
              onClick={() => onOpenChat(friend)}
            >
              {friend.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  