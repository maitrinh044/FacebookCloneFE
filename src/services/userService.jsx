// src/services/userService.jsx

import axiosClient from "../utils/axiosClient";


export const getUser = async () => {
    try {
        const response = await axiosClient.get('/getAllUsers');
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API getUser:", error);
        throw error; 
    }
};

export const getUserFriends = async () => {
    try {
        const response = await axiosClient.get('/getAllFriends/1');
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API getAllFriends:", error);
        throw error;
    }
}

export const getUserById = async (userId) => {
    try {
        const response = await axiosClient.get(`/getUserById/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API getUserById:", error);
        throw error;
    }
}
