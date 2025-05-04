import React, { useState } from 'react';
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

// Mock data
const mockPosts = [
  {
    id: '1',
    content: 'Chào mừng mọi người đến với cộng đồng của chúng tôi!',
    author: {
      id: '1',
      name: 'Nguyễn Văn A',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    createdAt: '2024-03-20T10:00:00',
    likes: 120,
    comments: 45,
    shares: 12,
    activeStatus: 'ACTIVE',
  },
  {
    id: '2',
    content: 'Hôm nay là một ngày đẹp trời!',
    author: {
      id: '2',
      name: 'Trần Thị B',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    createdAt: '2024-03-19T15:30:00',
    likes: 89,
    comments: 23,
    shares: 5,
    activeStatus: 'INACTIVE',
  },
  {
    id: '3',
    content: 'Chia sẻ một số hình ảnh từ chuyến đi cuối tuần của tôi.',
    author: {
      id: '3',
      name: 'Lê Văn C',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    createdAt: '2024-03-18T09:15:00',
    likes: 256,
    comments: 78,
    shares: 34,
    activeStatus: 'ACTIVE',
  },
];

const PostManagement: React.FC = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [hideDialogOpen, setHideDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleHideClick = (postId: string) => {
    setSelectedPostId(postId);
    setHideDialogOpen(true);
  };

  const handleHideConfirm = () => {
    if (selectedPostId) {
      // Chỉ cập nhật UI, không gọi API
      setPosts(posts.map(post => 
        post.id === selectedPostId 
          ? { ...post, activeStatus: post.activeStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : post
      ));
      setHideDialogOpen(false);
      setSelectedPostId(null);
    }
  };

  const handleHideCancel = () => {
    setHideDialogOpen(false);
    setSelectedPostId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý bài viết
        </Typography>
      </Box>

      {posts.length === 0 ? (
        <Typography>Không có bài viết nào</Typography>
      ) : (
        posts.map((post) => (
          <Card key={post.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={post.author.avatar} alt={post.author.name} />
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