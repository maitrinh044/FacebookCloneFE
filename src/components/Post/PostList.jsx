import { useState } from "react";
import PostItem from "../Post/PostItem";
import CreatePost from "../Post/CreatePost";

const samplePosts = [
  {
    id: 1,
    username: "An Nguyễn",
    userAvatar: "../../../src/assets/img/facebook.jpg",
    time: "2 giờ trước",
    content: "Hôm nay trời đẹp quá!",
    image: "../../../src/assets/img/facebook.jpg",
  },
  {
    id: 2,
    username: "Bảo Trân",
    userAvatar: "../../../src/assets/img/facebook.jpg",
    time: "1 giờ trước",
    content: "Mọi người đã xem bộ phim mới chưa?",
    image: "",
  },
];

export default function PostList() {
  const [posts, setPosts] = useState(samplePosts);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleSharePost = (sharedContent) => {
    const originalPost = posts.find(p => p.id === posts.id); // Đảm bảo bạn có logic lấy post gốc phù hợp
    const sharedPost = {
      ...originalPost,
      id: Date.now(),
      sharedBy: "Người dùng hiện tại",
      sharedContent,
      sharedTime: "Vừa xong",
      isShared: true
    };
    setPosts([sharedPost, ...posts]);
  };

  return (
    <div>
      <CreatePost onPostCreated={handlePostCreated} />
      {posts.map((post) => (
        <PostItem 
          key={post.id} 
          post={post} 
          onShare={handleSharePost}
        />
      ))}
    </div>
  );
}