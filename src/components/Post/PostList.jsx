import { useState, useEffect } from "react";
import PostItem from "../Post/PostItem";
import CreatePost from "../Post/CreatePost";
import { getAllPosts, createPost } from "../utils/PostService";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch posts");
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreated = async (newPost) => {
    try {
      const createdPost = await createPost(newPost);
      setPosts([createdPost, ...posts]);
    } catch (err) {
      setError("Failed to create post");
    }
  };

  const handleSharePost = async (sharedPost) => {
    try {
      const newSharedPost = await createPost({
        ...sharedPost,
        isShared: true,
        sharedTime: new Date().toISOString(),
      });
      setPosts([newSharedPost, ...posts]);
    } catch (err) {
      setError("Failed to share post");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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