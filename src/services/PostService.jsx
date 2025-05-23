import axiosClient from "../utils/axiosClient";

export const getPostById = async (id) => {
  try {
    const response = await axiosClient.get(`/posts/getPostByID/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy bài viết theo ID:', error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axiosClient.get(`/posts/getAllPosts`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả bài viết:', error);
    throw error;
  }
};

export const getPostsByUser = async (userId) => {
  try {
    const response = await axiosClient.get(`/posts/getPostsByUser/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy bài viết của người dùng:', error);
    throw error;
  }
};

export const getPostsByPage = async (pageId) => {
  try {
    const response = await axiosClient.get(`/posts/getPostsByPage/${pageId}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy bài viết của trang:', error);
    throw error;
  }
};

export const getPostsByGroup = async (groupId) => {
  try {
    const response = await axiosClient.get(`/posts/getPostsByGroup/${groupId}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy bài viết của nhóm:', error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axiosClient.post(`/posts/createPost`, postData);
    console.log('Đăng bài viết trong service!');
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi tạo bài viết:', error);
    alert(`Lỗi khi tạo bài viết: ${response.data.message}`);
    throw error;
  }
};

export const updatePost = async (postData) => {
  try {
    const response = await axiosClient.put(`/posts/updatePost`, postData);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật bài viết:', error);
    throw error;
  }
};

export const toggleActiveStatusPost = async (id) => {
  try {
    const response = await axiosClient.put(`/posts/controlActiveStatusPost/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi đổi trạng thái bài viết:', error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await axiosClient.delete(`/posts/deletePost/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa bài viết:', error);
    throw error;
  }
};

export const shareToProfile = async (userId, postId, caption) => {
  try {
    const data = {
      userId: userId,
      originalPostId: postId,
      caption: caption
    }
    console.log("data to share: ", data);
    const response = await axiosClient.post(`/posts/shareToProfile`, data);
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API shareToProfile:", error.response ? error.response.data : error.message);
    throw error;
  }
}
export const controlActiveStatus = async (postId) => {
  try {
    const response = await axiosClient.put(`/posts/controlActiveStatus/${postId}`);
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API controlActiveStatus:", error.response ? error.response.data : error.message);
    throw error;
  }
}
export const getPostByKeyword = async (keyword) => {
  try {
    const response = await axiosClient.get(`/posts/getByKeyword/${keyword}`);
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getByKeyword:", error.response ? error.response.data : error.message);
    throw error;
  }
}
export const getPostByStartAndEnd = async (start, end) => {
  try {
    const response = await axiosClient.get(`/posts/getByStartAndEnd?start=${start}&end=${end}`);
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getByKeyword:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export const getFriendPosts = async (userId) => {
  try {
    const response = await axiosClient.get(`/posts/getFriendPosts/${userId}`);
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getFriendPosts:", error.response ? error.response.data : error.message);
    throw error;
  }
}
export const getCountSharePost = async (postId) => {
  try {
    const response = await axiosClient.get(`/posts/getCountSharePost/${postId}`);
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getCountSharePost:", error.response ? error.response.data : error.message);
    throw error;
  }
}
export const imageAnalysisForCreateCaptionOfPost = async(imageUrl) => {
  try {
    const response = await axiosClient.get(`/posts/imageAnalysis?imageUrl=${imageUrl}`);
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getCountSharePost:", error.response ? error.response.data : error.message);
    throw error;
  }
}