import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';
import { getAllPosts, toggleActiveStatusPost, updatePost } from '../../services/PostService';


const PostManagement: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [hideDialogOpen, setHideDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải danh sách bài viết');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleHideClick = (postId: string) => {
    setSelectedPostId(postId);
    setHideDialogOpen(true);
  };

  const handleHideConfirm = async () => {
    if (selectedPostId) {
      try {
        const updatedPost = await toggleActiveStatusPost(selectedPostId);
        setPosts(posts.map(post =>
          post.id === selectedPostId
            ? { ...post, activeStatus: updatedPost.activeStatus }
            : post
        ));
        setHideDialogOpen(false);
        setSelectedPostId(null);
      } catch (err) {
        setError('Không thể thay đổi trạng thái bài viết');
      }
    }
  };

  const handleHideCancel = () => {
    setHideDialogOpen(false);
    setSelectedPostId(null);
  };

  console.log(posts);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý bài viết
        </Typography>
      </Box>

      {loading ? (
        <Typography>Đang tải...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : posts.length === 0 ? (
        <Typography>Không có bài viết nào</Typography>
      ) : (
        posts.map((post) => (
          <Card key={post.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={post?.author.avatar} alt={post?.author.name} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1" component="div">
                    {post.author.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(post.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.content}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={`${post.likes} likes`} size="small" />
                <Chip label={`${post.comments} comments`} size="small" />
                <Chip label={`${post.shares} shares`} size="small" />
                <Chip
                  label={post.activeStatus === 'ACTIVE' ? 'Đang hiển thị' : 'Đã ẩn'}
                  color={post.activeStatus === 'ACTIVE' ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <IconButton
                onClick={() => handleHideClick(post.id)}
                color={post.activeStatus === 'ACTIVE' ? 'error' : 'success'}
                title={post.activeStatus === 'ACTIVE' ? 'Ẩn bài viết' : 'Hiện bài viết'}
              >
                <BlockIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))
      )}

      <Dialog
        open={hideDialogOpen}
        onClose={handleHideCancel}
      >
        <DialogTitle>
          {selectedPostId && posts.find(p => p.id === selectedPostId)?.activeStatus === 'ACTIVE'
            ? 'Xác nhận ẩn bài viết'
            : 'Xác nhận hiện bài viết'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {selectedPostId && posts.find(p => p.id === selectedPostId)?.activeStatus === 'ACTIVE'
              ? 'Bạn có chắc chắn muốn ẩn bài viết này không?'
              : 'Bạn có chắc chắn muốn hiện bài viết này không?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHideCancel}>Hủy</Button>
          <Button
            onClick={handleHideConfirm}
            color={selectedPostId && posts.find(p => p.id === selectedPostId)?.activeStatus === 'ACTIVE' ? 'error' : 'success'}
          >
            {selectedPostId && posts.find(p => p.id === selectedPostId)?.activeStatus === 'ACTIVE' ? 'Ẩn' : 'Hiện'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostManagement;