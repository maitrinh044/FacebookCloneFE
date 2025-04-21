import axiosClient from '../utils/axiosClient';

// Dịch vụ xử lý các API liên quan đến danh sách bạn bè
const FriendlistService = {
  // Lấy danh sách bạn bè (trạng thái ACCEPTED)
  getFriends: async () => {
    try {
      const response = await axiosClient.get('/friendship/getFriends');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bạn bè:', error);
      throw error;
    }
  },

  // Lấy danh sách lời mời kết bạn (trạng thái PENDING, user_2 là người dùng hiện tại)
  getFriendRequests: async () => {
    try {
      const response = await axiosClient.get('/friendship/getRequests');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy lời mời kết bạn:', error);
      throw error;
    }
  },

  // Lấy danh sách gợi ý kết bạn
  getFriendSuggestions: async () => {
    try {
      const response = await axiosClient.get('/friendship/getSuggestions');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy gợi ý kết bạn:', error);
      throw error;
    }
  },

  // Gửi lời mời kết bạn
  addFriend: async (userId) => {
    try {
      const response = await axiosClient.post('/friendship/add', { userId });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gửi lời mời kết bạn:', error);
      throw error;
    }
  },

  // Chấp nhận lời mời kết bạn
  acceptFriendRequest: async (requestId) => {
    try {
      const response = await axiosClient.post('/friendship/accept', { requestId });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi chấp nhận lời mời kết bạn:', error);
      throw error;
    }
  },

  // Từ chối lời mời kết bạn hoặc xóa gợi ý
  declineFriendRequest: async (requestId) => {
    try {
      const response = await axiosClient.post('/friendship/decline', { requestId });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi từ chối lời mời kết bạn:', error);
      throw error;
    }
  },

  // Hủy kết bạn
  unfriend: async (friendId) => {
    try {
      const response = await axiosClient.post('/friendship/remove', { friendId });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi hủy kết bạn:', error);
      throw error;
    }
  },
};

export default FriendlistService;