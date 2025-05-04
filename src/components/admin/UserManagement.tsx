import React, { useState } from 'react';
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
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

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

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    active_status: 'ACTIVE',
    biography: 'Frontend Developer with 5 years of experience',
    birthday: '1990-05-15',
    cover_photo: 'https://picsum.photos/800/300?random=1',
    create_at: '2023-01-01T10:00:00',
    email: 'john.doe@example.com',
    first_name: 'John',
    gender: 'MALE',
    is_online: true,
    last_name: 'Doe',
    password: 'hashed_password_1',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    active_status: 'INACTIVE',
    biography: 'Backend Developer specializing in Node.js',
    birthday: '1992-08-20',
    cover_photo: 'https://picsum.photos/800/300?random=2',
    create_at: '2023-02-15T14:30:00',
    email: 'jane.smith@example.com',
    first_name: 'Jane',
    gender: 'FEMALE',
    is_online: false,
    last_name: 'Smith',
    password: 'hashed_password_2',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    active_status: 'ACTIVE',
    biography: 'Full Stack Developer and UI/UX Designer',
    birthday: '1988-03-10',
    cover_photo: 'https://picsum.photos/800/300?random=3',
    create_at: '2023-03-20T09:15:00',
    email: 'mike.wilson@example.com',
    first_name: 'Mike',
    gender: 'MALE',
    is_online: true,
    last_name: 'Wilson',
    password: 'hashed_password_3',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    active_status: 'ACTIVE',
    biography: 'DevOps Engineer with cloud expertise',
    birthday: '1995-11-25',
    cover_photo: 'https://picsum.photos/800/300?random=4',
    create_at: '2023-04-05T16:45:00',
    email: 'sarah.johnson@example.com',
    first_name: 'Sarah',
    gender: 'FEMALE',
    is_online: false,
    last_name: 'Johnson',
    password: 'hashed_password_4',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    active_status: 'INACTIVE',
    biography: 'Mobile App Developer',
    birthday: '1993-07-08',
    cover_photo: 'https://picsum.photos/800/300?random=5',
    create_at: '2023-05-12T11:20:00',
    email: 'david.brown@example.com',
    first_name: 'David',
    gender: 'MALE',
    is_online: true,
    last_name: 'Brown',
    password: 'hashed_password_5',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '6',
    active_status: 'ACTIVE',
    biography: 'Data Scientist and Machine Learning Engineer',
    birthday: '1991-04-30',
    cover_photo: 'https://picsum.photos/800/300?random=6',
    create_at: '2023-06-18T13:20:00',
    email: 'emma.wilson@example.com',
    first_name: 'Emma',
    gender: 'FEMALE',
    is_online: true,
    last_name: 'Wilson',
    password: 'hashed_password_6',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: '7',
    active_status: 'INACTIVE',
    biography: 'UI/UX Designer with 4 years of experience',
    birthday: '1994-09-12',
    cover_photo: 'https://picsum.photos/800/300?random=7',
    create_at: '2023-07-22T08:45:00',
    email: 'alex.turner@example.com',
    first_name: 'Alex',
    gender: 'MALE',
    is_online: false,
    last_name: 'Turner',
    password: 'hashed_password_7',
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
  {
    id: '8',
    active_status: 'ACTIVE',
    biography: 'Product Manager with strong technical background',
    birthday: '1989-12-05',
    cover_photo: 'https://picsum.photos/800/300?random=8',
    create_at: '2023-08-30T15:10:00',
    email: 'lisa.martin@example.com',
    first_name: 'Lisa',
    gender: 'FEMALE',
    is_online: true,
    last_name: 'Martin',
    password: 'hashed_password_8',
    avatar: 'https://i.pravatar.cc/150?img=8',
  }
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
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

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'primary';
      case 'moderator':
        return 'secondary';
      case 'user':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      biography: '',
    });
    setEditDialogOpen(true);
  };

  const handleStatusClick = (user: User) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (selectedUser) {
      // Implement the logic to update the user in the backend
      setViewDialogOpen(false);
    }
  };

  const handleStatusChange = () => {
    if (selectedUser) {
      // Implement the logic to update the user status in the backend
      setStatusDialogOpen(false);
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button variant="contained" color="primary">
          Add New User
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users..."
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
            {mockUsers.map((user) => (
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
                    color={user.active_status === 'ACTIVE' ? 'success' : 'error'}
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

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
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
                Join Date: {selectedUser.create_at.split('T')[0]}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
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

      {/* Status Dialog */}
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