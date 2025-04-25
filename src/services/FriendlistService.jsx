import axiosClient from "../utils/axiosClient";

// Lấy tất cả các mối quan hệ bạn bè
export const getAllFriendships = async () => {
  try {
    const response = await axiosClient.get('/friendships/getAllFriendships');
    console.log("API Response - getAllFriendships:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getAllFriendships:", error);
    throw new Error(`Lỗi khi lấy danh sách bạn bè: ${error.response?.data?.message || error.message}`);
  }
};

// Lấy tất cả các yêu cầu kết bạn
export const getAllFriendshipRequests = async () => {
  try {
    const response = await axiosClient.get('/friendships/getAllFriendshipRequests');
    console.log("API Response - getAllFriendshipRequests:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getAllFriendshipRequests:", error);
    throw new Error(`Lỗi khi lấy danh sách yêu cầu kết bạn: ${error.response?.data?.message || error.message}`);
  }
};

// Lấy các yêu cầu kết bạn đang chờ cho một người dùng
export const getPendingRequests = async (userId) => {
  try {
    const response = await axiosClient.get(`/friendships/getPendingRequests/${userId}`);
    console.log("API Response - getPendingRequests (full response):", response);
    const data = response.data?.data || [];
    if (!Array.isArray(data)) {
      console.warn(`Expected array but got: ${JSON.stringify(data)}`);
      return [];
    }
    console.log("API Response - getPendingRequests (data):", data);
    return data;
  } catch (error) {
    console.error(`Lỗi khi gọi API getPendingRequests cho userId ${userId}:`, error);
    throw new Error(`Lỗi khi lấy yêu cầu kết bạn: ${error.response?.data?.message || error.message}`);
  }
};

// Lấy thông tin một mối quan hệ bạn bè theo ID
export const getFriendshipById = async (friendshipId) => {
  try {
    const response = await axiosClient.get(`/friendships/getFriendshipById/${friendshipId}`);
    console.log("API Response - getFriendshipById:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getFriendshipById:", error);
    throw new Error(`Lỗi khi lấy thông tin bạn bè: ${error.response?.data?.message || error.message}`);
  }
};

// Gửi một yêu cầu kết bạn mới
export const addFriendship = async (friendshipData) => {
  try {
    console.log("Sending friendshipData:", JSON.stringify(friendshipData));
    const response = await axiosClient.post('/friendships/addFriendship', friendshipData);
    console.log("API Response - addFriendship:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API addFriendship:", error);
    console.log("Chi tiết lỗi từ server:", error.response?.data); // Thêm log chi tiết
    throw new Error(`Lỗi khi gửi lời mời kết bạn: ${error.response?.data?.message || error.message}`);
  }
};

// Cập nhật trạng thái mối quan hệ bạn bè (chấp nhận/từ chối)
export const updateFriendship = async (friendshipData) => {
  try {
    const response = await axiosClient.put('/friendships/updateFriendship', friendshipData);
    console.log("API Response - updateFriendship:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API updateFriendship:", error);
    throw new Error(`Lỗi khi cập nhật trạng thái bạn bè: ${error.response?.data?.message || error.message}`);
  }
};