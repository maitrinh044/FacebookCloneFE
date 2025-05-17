import { useState, useEffect } from "react";
import PostItem from "../Post/PostItem";
import CreatePost from "../Post/CreatePost";
import { getFriendPosts, createPost, shareToProfile } from "../../services/PostService";
import { controlActiveStatus, getReactionByPostId, getReactionsByUserId, getUserById } from "../../services/profileService";
import { useFetchUser } from "../../utils/useFetchUser";
import { func } from "prop-types";
import { FaEllipsisH, FaFacebookMessenger, FaGlobe, FaShare, FaThumbsUp, FaUserCircle } from "react-icons/fa";
import PostByShare from "./PostByShare";
import { controlReaction } from "../../services/CommentService";

export default function PostList() {
  const [posts, setPosts] = useState([]); // Dữ liệu các bài viết
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [user, setUser] = useState(null);
  const [reactionByPost, setReactionByPost] = useState([]);
  const [commentByPost, setCommentByPost] = useState([]);
  const [reactionByUser, setReactionByUser] = useState([]);
  const [reactionTypes, setReactionTypes] = useState([]);

  const id = localStorage.getItem("userId");


  // Hàm gọi API để lấy danh sách các bài viết
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getFriendPosts(id); // Lấy dữ liệu từ API
        const response2 = await getUserById(id);
        if (response2) {
          // console.log('user in useEffect: ', response2);
          setUser(response2);
        }
        // setUser(res)
        setPosts(data); // Lưu vào state posts
        setLoading(false); // Đổi trạng thái loading
        const tmp2 = await getReactionsByUserId(id); // Lấy người dùng bằng ID
        setReactionByUser(tmp2);
        const reactionPromises = data.map(post1 => {
            return getReactionByPostId(post1.id).then(reactions => ({
                postId: post1.id,
                reactions
            }));
        });
        // Chờ cho tất cả các yêu cầu reactions hoàn thành
        const tmp1 = await Promise.all(reactionPromises);
        setReactionByPost(tmp1);
      } catch (err) {
        console.error("Error fetching posts:", err); // Log lỗi
        setError("Failed to fetch posts"); // Thiết lập lỗi nếu có
        setLoading(false); // Đổi trạng thái loading
      }
    };
    fetchPosts(); // Gọi hàm fetchPosts khi component mount
  }, [id]); // Chỉ gọi một lần khi component mount

  console.log('reactionByPost: ', reactionByPost);
  console.log('reactionByUser: ', reactionByUser);
  function getReactionByPost(postId) {
    const reaction = reactionByPost.find(e => e.postId == postId);
    return reaction || [];
  }
  console.log('reactionByPost in id = 2: ', getReactionByPost(2).reactions != [] ? getReactionByPost(2).reactions : []);
  console.log('reactionByPost in id = 6: ', getReactionByPost(6).reactions != [] ? getReactionByPost(6).reactions : []);
  // Hàm xử lý khi tạo bài viết mới
  const handlePostCreated = async (newPost) => {
    try {
      const createdPost = await createPost(newPost); // Gửi dữ liệu tạo bài viết mới đến API
      setPosts([createdPost, ...posts]); // Thêm bài viết mới vào đầu danh sách
    } catch (err) {
      console.error("Error creating post:", err); // Log lỗi nếu có
      setError("Failed to create post"); // Thiết lập lỗi nếu có
    }
  };

  // Hàm xử lý khi chia sẻ bài viết
  const handleSharePost = async (userId, postId, caption) => {

    try {
      const response = await shareToProfile(userId, postId, caption);
      // const list = await
    } catch (error) {
      console.error("Lỗi khi share bài viết! ", error);
    }
  };

  const controlActiveStatusPost = async (userId, postId) => {
    try {
      const response = await controlActiveStatus(postId);

      const updatedComments = await getFriendPosts(id);
      setPosts(updatedComments);
    } catch (error) {
      console.error("Lỗi khi điều chỉnh bài viết:", error);
    }
  }

  const controlReactionUser = async (userId, targetType, targetId, reactionType) => {
    try {
      const newReaction = await controlReaction(userId, targetType, targetId, reactionType);
      const data = await getReactionsByUserId(userId);
      setReactionByUser(data);
      const updatedComments = await getFriendPosts(userId);
      const tmp2 = await getReactionsByUserId(userId); // Lấy người dùng bằng ID
      setReactionByUser(tmp2);
      const reactionPromises = updatedComments.map(post1 => {
          return getReactionByPostId(post1.id).then(reactions => ({
              postId: post1.id,
              reactions
          }));
      });
      // Chờ cho tất cả các yêu cầu reactions hoàn thành
      const tmp1 = await Promise.all(reactionPromises);
      setReactionByPost(tmp1);
      setPosts(updatedComments);
    } catch (error) {
      const tmp2 = await getReactionsByUserId(userId); // Lấy người dùng bằng ID
      setReactionByUser(tmp2);
      const updatedComments = await getFriendPosts(userId);
      const reactionPromises = updatedComments.map(post1 => {
          return getReactionByPostId(post1.id).then(reactions => ({
              postId: post1.id,
              reactions
          }));
      });
      // Chờ cho tất cả các yêu cầu reactions hoàn thành
      const tmp1 = await Promise.all(reactionPromises);
      setReactionByPost(tmp1);
      setPosts(updatedComments);
      console.error("Lỗi khi điều khiển phản ứng:", error);
    }
  };


  const { users } = useFetchUser();

  function getPostById(postId) {
    const post = posts.find(e => e.id === postId);
    return post || [];
  }
  function formatDateString(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }
  // console.log('posts: ', posts);
  // Kiểm tra trạng thái loading và lỗi
  if (loading) return <div>Loading...</div>; // Hiển thị khi đang loading
  if (error) return <div>{error}</div>; // Hiển thị khi có lỗi

  // console.log("user: ", user);

  return (
    <div>
      <CreatePost onPostCreated={handlePostCreated}  currentUser={user}/> {/* Component tạo bài viết mới */}
      {posts.length === 0 ? (
        <div>No posts available</div> // Thông báo nếu không có bài viết
      ) : (
        posts.map((post) => (
          <div>
            {post.activeStatus === 'ACTIVE' && (
              <div>
                {post.originalPostId == null ? (
                  <PostItem isOwnProfile={user.id == id} reactionByUser={reactionByUser} reactionByPost={getReactionByPost(post.id).reactions != [] ? getReactionByPost(post.id).reactions : []} controlReactionUser={controlReactionUser} key={post.id} post={post} onShare={handleSharePost} user={user} controlActiveStatusPost={controlActiveStatusPost} users={users} /> // Hiển thị các bài viết
                ) : (
                  <PostByShare isOwnProfile={user.id == id} reactionByUser={reactionByUser} reactionByPost={getReactionByPost(post.id).reactions != [] ? getReactionByPost(post.id).reactions : []} controlReactionUser={controlReactionUser} posts={posts} key={post.id} post={post} onShare={handleSharePost} user={user} controlActiveStatusPost={controlActiveStatusPost} users={users} />
                )}
              </div>
            )}

          </div>

        ))
      )}
    </div>
  );
}
