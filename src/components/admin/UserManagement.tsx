import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { getUser, getUserById } from '../../services/userService';

interface User {
  id: string;
  active_status: string;
  biography: string;
  birthday: string;
  cover_photo: string;
  create_at: string;
  email: string;
  first_name: string;
  gender: string;
  is_online: boolean;
  last_name: string;
  password: string;
  avatar: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    biography: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUser();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải danh sách người dùng');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'banned':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewUser = async (user: User) => {
    try {
      const userData = await getUserById(user.id);
      setSelectedUser(userData);
      setViewDialogOpen(true);
    } catch (err) {
      setError('Không thể tải thông tin người dùng');
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      biography: user.biography || '',
    });
    setEditDialogOpen(true);
  };

  const handleStatusClick = (user: User) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (selectedUser) {
      try {
        // TODO: Call API to update user (e.g., updateUser)
        // await updateUser({ id: selectedUser.id, ...editForm });
        setUsers(users.map(user =>
          user.id === selectedUser.id ? { ...user, ...editForm } : user
        ));
        setEditDialogOpen(false);
      } catch (err) {
        setError('Không thể cập nhật thông tin người dùng');
      }
    }
  };

  const handleStatusChange = async () => {
    if (selectedUser) {
      try {
        // TODO: Call API to toggle user status (e.g., toggleUserStatus)
        // await toggleUserStatus(selectedUser.id);
        setUsers(users.map(user =>
          user.id === selectedUser.id
            ? { ...user, active_status: user.active_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
            : user
        ));
        setStatusDialogOpen(false);
      } catch (err) {
        setError('Không thể thay đổi trạng thái người dùng');
      }
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý người dùng
        </Typography>
        <Button variant="contained" color="primary">
          Thêm người dùng mới
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Typography>Đang tải...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredUsers.length === 0 ? (
        <Typography>Không tìm thấy người dùng nào</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Online</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                  </TableCell>
                  <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender === 'MALE' ? 'Nam' : 'Nữ'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.active_status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                      color={getStatusColor(user.active_status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_online ? 'Online' : 'Offline'}
                      color={user.is_online ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewUser(user)} color="primary">
                      <ViewIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditClick(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleStatusClick(user)}
                      color={user.active_status === 'ACTIVE' ? 'error' : 'success'}
                    >
                      <BlockIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết người dùng</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedUser.avatar} alt={selectedUser.first_name + ' ' + selectedUser.last_name} sx={{ width: 64, height: 64 }} />
                <Box>
                  <Typography variant="h6">{selectedUser.first_name + ' ' + selectedUser.last_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2">
                Ngày tham gia: {new Date(selectedUser.create_at).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="first_name"
              label="Tên"
              value={editForm.first_name}
              onChange={handleFormChange}
            />
            <TextField
              name="last_name"
              label="Họ"
              value={editForm.last_name}
              onChange={handleFormChange}
            />
            <TextField
              name="email"
              label="Email"
              value={editForm.email}
              onChange={handleFormChange}
            />
            <TextField
              name="gender"
              select
              label="Giới tính"
              value={editForm.gender}
              onChange={handleFormChange}
            >
              <MenuItem value="MALE">Nam</MenuItem>
              <MenuItem value="FEMALE">Nữ</MenuItem>
            </TextField>
            <TextField
              name="biography"
              label="Tiểu sử"
              multiline
              rows={4}
              value={editForm.biography}
              onChange={handleFormChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>
          {selectedUser?.active_status === 'ACTIVE' ? 'Vô hiệu hóa người dùng' : 'Kích hoạt người dùng'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {selectedUser?.active_status === 'ACTIVE'
              ? 'Bạn có chắc chắn muốn vô hiệu hóa người dùng này không?'
              : 'Bạn có chắc chắn muốn kích hoạt người dùng này không?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleStatusChange}
            color={selectedUser?.active_status === 'ACTIVE' ? 'error' : 'success'}
            variant="contained"
          >
            {selectedUser?.active_status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;