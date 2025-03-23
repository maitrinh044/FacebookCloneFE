// src/services/MessageService.jsx

import axiosClient from "../utils/axiosClient";

export const getMessageList = async (senderId, receiverId) => {
  try {
    const response = await axiosClient.get(
      `/getMessageByUser?senderId=${senderId}&receiverId=${receiverId}`
    );
    return response.data?.data || [];
  } catch (error) {
    console.error("Lỗi khi gọi API getMessageByUser:", error);
    throw error;
  }
};

export const addNewMessage = async (msg) => {
  try {
    console.log(msg);
    const response = await axiosClient.post(`/addNewMessage`, msg); // truyền msg vào body
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API addNewMessage:", error);
    throw error;
  }
};

export const getLastMessage = async (senderId, receiverId) => {
  try {
    const response = await axiosClient.get(`/getLastMessage?senderId=${senderId}&receiverId=${receiverId}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getLastMessage:", error);
    throw error;
  }
}
