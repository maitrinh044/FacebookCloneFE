import axiosClient from "../utils/axiosClient";

export const getCommentsByPost = async (postId) => {
  try {
    const response = await axiosClient.get(`/comments/post/${postId}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy bình luận:', error);
    throw error;
  }
};

export const createComment = async (commentData) => {
  try {
    const response = await axiosClient.post(`/comments`, commentData);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi tạo bình luận:', error);
    throw error;
  }
};

export const updateComment = async (id, commentData) => {
  try {
    const response = await axiosClient.put(`/comments/${id}`, commentData);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật bình luận:', error);
    throw error;
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await axiosClient.delete(`/comments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa bình luận:', error);
    throw error;
  }
};

export const controlActiveStatusComment = async(id) => {
  try {
    const response = await axiosClient.put(
      `/comments/controlActiveStatus/${id}`
    );
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API controlActiveStatusComment:", error.response ? error.response.data : error.message);
    throw error;
  }
}