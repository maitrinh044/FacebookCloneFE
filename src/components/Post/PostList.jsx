import { useState, useEffect } from "react";
import PostItem from "../Post/PostItem";
import CreatePost from "../Post/CreatePost";
import { getAllPosts, createPost, shareToProfile } from "../../services/PostService";
import { controlActiveStatus, getUserById } from "../../services/profileService";
import useFetchUser from "../../utils/useFetchUser";

export default function PostList() {
  const [posts, setPosts] = useState([]); // Dữ liệu các bài viết
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [user, setUser] = useState(null);
  const id = localStorage.getItem("userId");
  

  // Hàm gọi API để lấy danh sách các bài viết
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts(); // Lấy dữ liệu từ API
        console.log("Fetched posts:", data); // Kiểm tra dữ liệu nhận được
        const response2 = await getUserById(id);
        if (response2) {
            setUser(response2);
        }
        setPosts(data); // Lưu vào state posts
        setLoading(false); // Đổi trạng thái loading
      } catch (err) {
        console.error("Error fetching posts:", err); // Log lỗi
        setError("Failed to fetch posts"); // Thiết lập lỗi nếu có
        setLoading(false); // Đổi trạng thái loading
      }
    };
    fetchPosts(); // Gọi hàm fetchPosts khi component mount
  }, [id]); // Chỉ gọi một lần khi component mount

  // Hàm xử lý khi tạo bài viết mới
  const handlePostCreated = async (newPost) => {
    try {
      const createdPost = await createPost(newPost); // Gửi dữ liệu tạo bài viết mới đến API
      console.log("Created post:", createdPost); // Kiểm tra post mới tạo
      setPosts([createdPost, ...posts]); // Thêm bài viết mới vào đầu danh sách
    } catch (err) {
      console.error("Error creating post:", err); // Log lỗi nếu có
      setError("Failed to create post"); // Thiết lập lỗi nếu có
    }
  };

  // Hàm xử lý khi chia sẻ bài viết
  const handleSharePost = async (sharedPost) => {
    try {
      const newSharedPost = await createPost({
        ...sharedPost,
        isShared: true,
        sharedTime: new Date().toISOString(),
      });
      console.log("Created shared post:", newSharedPost); // Kiểm tra bài viết chia sẻ
      setPosts([newSharedPost, ...posts]); // Thêm bài viết chia sẻ vào danh sách
    } catch (err) {
      console.error("Error sharing post:", err); // Log lỗi nếu có
      setError("Failed to share post"); // Thiết lập lỗi nếu có
    }
    console.log("ban dang share post den profile")
  };

  const controlActiveStatusPost = async (userId, postId) => {
          try {
              const response = await controlActiveStatus(postId); 
  
              const updatedComments = await getPostByUser(userId);
              setPosts(updatedComments);
          } catch (error) {
              console.error("Lỗi khi điều chỉnh bài viết:", error);
          }
      }
  const share = async (userId, postId, caption) => {
    // try {
    //   const response = await shareToProfile(userId, postId, caption);
    //   // const list = await
    // } catch (error) {
    //   console.error("Lỗi khi share bài viết! ", error);
    // }
    console.log("Bạn đã click share post!");
  }
    const {users} = useFetchUser();
    console.log("users: ", users);
  // Kiểm tra trạng thái loading và lỗi
  if (loading) return <div>Loading...</div>; // Hiển thị khi đang loading
  if (error) return <div>{error}</div>; // Hiển thị khi có lỗi

  return (
    <div>
      <CreatePost onPostCreated={handlePostCreated} /> {/* Component tạo bài viết mới */}
      {posts.length === 0 ? (
        <div>No posts available</div> // Thông báo nếu không có bài viết
      ) : (
        posts.map((post) => (
          <PostItem key={post.id} post={post} onShare={handleSharePost} user={user} controlActiveStatusPost={controlActiveStatusPost} users={users}/> // Hiển thị các bài viết
        ))
      )}
    </div>
  );
}
