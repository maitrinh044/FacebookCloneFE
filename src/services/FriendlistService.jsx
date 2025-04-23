import axiosClient from "../utils/axiosClient";

// Lấy tất cả các mối quan hệ bạn bè
export const getAllFriendships = async () => {
    try {
        const response = await axiosClient.get('/friendships/getAllFriendships');
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API getAllFriendships:", error);
        throw new Error(`Lỗi khi lấy danh sách bạn bè: ${error.response?.data?.message || error.message}`);
    }
};

// Lấy các yêu cầu kết bạn đang chờ cho một người dùng
export const getPendingRequests = async (userId) => {
    try {
        const response = await axiosClient.get(`/friendships/pending/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Lỗi khi gọi API getPendingRequests cho userId ${userId}:`, error);
        throw new Error(`Lỗi khi lấy yêu cầu kết bạn: ${error.response?.data?.message || error.message}`);
    }
};

// Lấy thông tin một mối quan hệ bạn bè theo ID
export const getFriendshipById = async (friendshipId) => {
    try {
        const response = await axiosClient.get(`/friendships/${friendshipId}`);
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API getFriendshipById:", error);
        throw new Error(`Lỗi khi lấy thông tin bạn bè: ${error.response?.data?.message || error.message}`);
    }
};

// Gửi một yêu cầu kết bạn mới
export const addFriendship = async (friendshipData) => {
    try {
        const response = await axiosClient.post('/friendships', friendshipData);
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API addFriendship:", error);
        throw new Error(`Lỗi khi gửi lời mời kết bạn: ${error.response?.data?.message || error.message}`);
    }
};

// Cập nhật trạng thái mối quan hệ bạn bè (chấp nhận/từ chối)
export const updateFriendship = async (friendshipData) => {
    try {
        const response = await axiosClient.put('/friendships', friendshipData);
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API updateFriendship:", error);
        throw new Error(`Lỗi khi cập nhật trạng thái bạn bè: ${error.response?.data?.message || error.message}`);
    }
};  