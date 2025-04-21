

import axiosClient from "../utils/axiosClient";

export const getUser = async () => {
    try {
        const response = await axiosClient.get('/users/getAllUsers');
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API getUser:", error);
        throw error; 
    }
};

export const getUserFriends = async (userId) => {
    try {
        // Gọi API với userId truyền vào
        const response = await axiosClient.get(`/users/getAllFriends/${userId}`);
        return response.data.data;  // Giả sử dữ liệu trả về nằm trong 'data.data'
    } catch (error) {
        console.error(`Lỗi khi gọi API getAllFriends cho userId ${userId}:`, error);
        // Trả về lỗi chi tiết nếu có
        throw new Error(`Lỗi khi lấy bạn bè: ${error.response ? error.response.data.message : error.message}`);
    }
}

export const getUserById = async (userId) => {
    try {
        const response = await axiosClient.get(`/users/getUserById/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API getUserById:", error);
        throw error;
    }
}

export const getJoinedGroup = async (userId) => {
    try {
        const response = await axiosClient.get(`/users/getGroupsByUserId/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API getJoinedGroup:", error);
        throw error;
    }
};
