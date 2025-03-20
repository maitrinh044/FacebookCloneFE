import { useState } from "react";
import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegCommentDots,
  FaShare,
} from "react-icons/fa";

export default function PostItem({ post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Giả lập người dùng đang đăng nhập
  const currentUser = {
    name: "Nguyễn Văn A",
    avatar: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/458161522_2243394162660512_7913931544320209269_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFE4H0KfJHUauSeB90nsw9jIBJwHuSktOAgEnAe5KS04F5KUxSkb8DlPyoPUcf2mlb9fV6MzqCuAtSLoc7Ay6-A&_nc_ohc=CXoMMnzvULoQ7kNvgEh0ypF&_nc_oc=Adhd1HcZH8ihnu0nOpaHQL9P6zFJqIzADQy2tSGyfmQKeSJV_6Hkf7Xvt4OoxnzJG3Y&_nc_zt=23&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=AQR7ZI_aDJOrecOKCXIigMN&oh=00_AYGQ7t7qCRDcZNQEIHRWgbCoYPYdNv04Mz2JyaDNxAK61w&oe=67D6AB59",
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(timestamp)) / 1000); // tính bằng giây
  
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };
  

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = () => {
    if (commentInput.trim() !== "") {
      const newComment = {
        name: currentUser.name,
        avatar: currentUser.avatar,
        text: commentInput,
      };
      setComments([...comments, newComment]);
      setCommentInput("");
    }
  };

  const newComment = {
    name: currentUser.name,
    avatar: currentUser.avatar,
    text: commentInput,
    time: new Date().toISOString(), // lưu thời gian ISO
  };
  

  const handleShare = () => {
    alert("Bài viết đã được chia sẻ! (Mô phỏng)");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      {/* Header bài viết */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={post.userAvatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{post.username}</p>
          <p className="text-sm text-gray-500">{post.time}</p>
        </div>
      </div>

      {/* Nội dung bài viết */}
      <p className="text-gray-700 mb-2">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="rounded-lg max-h-96 w-full object-cover mt-2"
        />
      )}

      {/* Action buttons */}
      <div className="mt-3 flex gap-6 text-gray-600 text-sm border-t pt-2">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-blue-600 transition"
        >
          {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
          {liked ? "Đã thích" : "Thích"} ({likesCount})
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 hover:text-blue-600 transition"
        >
          <FaRegCommentDots />
          Bình luận ({comments.length})
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 hover:text-blue-600 transition"
        >
          <FaShare />
          Chia sẻ
        </button>
      </div>

      {/* Bình luận */}
      {showComments && (
        <div className="mt-4 border-t pt-3">
          {/* Nhập bình luận */}
          <div className="flex gap-2 mb-2">
            <img
              src={currentUser.avatar}
              alt="me"
              className="w-8 h-8 rounded-full object-cover"
            />
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Viết bình luận..."
              className="flex-1 p-2 rounded-lg border text-sm"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-3 rounded-lg text-sm hover:bg-blue-600"
            >
              Gửi
            </button>
          </div>

          {/* Danh sách bình luận */}
          <div className="space-y-3">
          {comments.map((comment, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <img
                src={comment.avatar}
                alt={comment.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="bg-gray-100 px-3 py-2 rounded-xl">
                <p className="font-semibold text-sm text-gray-800">{comment.name}</p>
                <p className="text-sm text-gray-700">{comment.text}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.time)}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
