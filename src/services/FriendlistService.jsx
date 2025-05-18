import axiosClient from "../utils/axiosClient";

// Lấy tất cả các mối quan hệ bạn bè
export const getAllFriendships = async () => {
  try {
    const response = await axiosClient.get('/friendships/getAllFriendships');
    console.log("API Response - getAllFriendships:", response.data);
    const data = response.data?.data || [];
    if (!Array.isArray(data)) {
      console.warn("getAllFriendships: Expected array but got:", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API getAllFriendships:", error.response || error);
    throw new Error(`Lỗi khi lấy danh sách bạn bè: ${error.response?.data?.message || error.message}`);
  }
};

// Lấy tất cả các yêu cầu kết bạn
export const getAllFriendshipRequests = async () => {
  try {
    const response = await axiosClient.get('/friendships/getAllFriendshipRequests');
    console.log("API Response - getAllFriendshipRequests:", response.data);
    const data = response.data?.data || [];
    if (!Array.isArray(data)) {
      console.warn("getAllFriendshipRequests: Expected array but got:", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API getAllFriendshipRequests:", error.response || error);
    throw new Error(`Lỗi khi lấy danh sách yêu cầu kết bạn: ${error.response?.data?.message || error.message}`);
  }
};

// Lấy các yêu cầu kết bạn đang chờ cho một người dùng
export const getPendingRequests = async (userId) => {
  try {
    if (!userId || isNaN(parseInt(userId))) {
      console.error("getPendingRequests: Invalid userId:", userId);
      throw new Error("ID người dùng không hợp lệ");
    }
    const response = await axiosClient.get(`/friendships/getPendingRequests/${userId}`);
    console.log("API Response - getPendingRequests:", response.data);
    const data = response.data?.data || [];
    if (!Array.isArray(data)) {
      console.warn("getPendingRequests: Expected array but got:", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error(`Lỗi khi gọi API getPendingRequests cho userId ${userId}:`, error.response || error);
    throw new Error(`Lỗi khi lấy yêu cầu kết bạn: ${error.response?.data?.message || error.message}`);
  }
};

// Lấy thông tin một mối quan hệ bạn bè theo ID
export const getFriendshipById = async (friendshipId) => {
  try {
    if (!friendshipId || isNaN(parseInt(friendshipId))) {
      console.error("getFriendshipById: Invalid friendshipId:", friendshipId);
      throw new Error("ID mối quan hệ không hợp lệ");
    }
    const response = await axiosClient.get(`/friendships/getFriendshipById/${friendshipId}`);
    console.log("API Response - getFriendshipById:", response.data);
    return response.data?.data || null;
  } catch (error) {
    console.error("Lỗi khi gọi API getFriendshipById:", error.response || error);
    throw new Error(`Lỗi khi lấy thông tin bạn bè: ${error.response?.data?.message || error.message}`);
  }
};

// Gửi một yêu cầu kết bạn mới
export const addFriendship = async (friendshipData) => {
  try {
    if (!friendshipData || !friendshipData.user1?.id || !friendshipData.user2?.id || !friendshipData.type) {
      console.error("addFriendship: Invalid friendshipData:", friendshipData);
      throw new Error("Dữ liệu lời mời kết bạn không hợp lệ");
    }
    // Đảm bảo gửi activeStatus mặc định là ACTIVE
    const payload = {
      ...friendshipData,
      activeStatus: "ACTIVE",
      createdAt: new Date().toISOString() // BE sẽ tự set createdAt, nhưng gửi để đảm bảo
    };
    console.log("Sending friendshipData to API:", JSON.stringify(payload, null, 2));
    const response = await axiosClient.post('/friendships/addFriendship', payload);
    console.log("API Response - addFriendship:", response.data);
    if (!response.data?.data) {
      console.warn("addFriendship: No data in response:", response.data);
    }
    return response.data?.data || null;
  } catch (error) {
    console.error("Lỗi khi gọi API addFriendship:", error.response || error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi không xác định";
    throw new Error(`Lỗi khi gửi lời mời kết bạn: ${errorMessage}`);
  }
};

// Cập nhật trạng thái mối quan hệ bạn bè (chấp nhận/từ chối)
export const updateFriendship = async (friendshipData) => {
  try {
    if (!friendshipData || !friendshipData.id || !friendshipData.type) {
      console.error("updateFriendship: Invalid friendshipData:", friendshipData);
      throw new Error("Dữ liệu cập nhật mối quan hệ không hợp lệ");
    }
    // Đảm bảo gửi activeStatus và createdAt từ dữ liệu gốc
    const payload = {
      ...friendshipData,
      activeStatus: friendshipData.activeStatus || "ACTIVE"
    };
    console.log("Updating friendshipData:", JSON.stringify(payload, null, 2));
    const response = await axiosClient.put('/friendships/updateFriendship', payload);
    console.log("API Response - updateFriendship:", response.data);
    return response.data?.data || null;
  } catch (error) {
    console.error("Lỗi khi gọi API updateFriendship:", error.response || error);
    throw new Error(`Lỗi khi cập nhật trạng thái bạn bè: ${error.response?.data?.message || error.message}`);
  }
};