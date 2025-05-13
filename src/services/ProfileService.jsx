import axiosClient from "../utils/axiosClient";

export const getPostByUser = async (userId) => {
  try {
    const response = await axiosClient.get(
      `/posts/getPostByUser/${userId}`
    );
    // console.log("response: ", response.data?.data);
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getPostsByUser:", error.response ? error.response.data : error.message);
    
    throw error;
  }
};
export const getUserById = async (userId) => {
    try {
      const response = await axiosClient.get(
        `/users/getUserById/${userId}`
      );
    //   console.log("response user: ", response.data?.data);
      return response.data?.data;
    } catch (error) {
      console.error("Lỗi khi gọi API getUserById:", error.response ? error.response.data : error.message);
      throw error;
    }
};
export const getReactionByPostId = async (postId) => {
    try {
      const response = await axiosClient.get(
        `/reactions/POST/${postId}`
      );
    //   console.log("response user: ", response.data?.data);
      return response.data?.data;
    } catch (error) {
      console.error("Lỗi khi gọi API lấy reactions by postId:", error.response ? error.response.data : error.message);
      throw error;
    }
};
export const getCommentByPost = async (postId) => {
    try {
      const response = await axiosClient.get(
        `/comments/POST/${postId}`
      );
    //   console.log("response getCommentByPost: ", response.data?.data);
      return response.data?.data;
    } catch (error) {
      console.error("Lỗi khi gọi API getCommentByPost:", error.response ? error.response.data : error.message);
      throw error;
    }
};
export const getFriendsByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(
      `/users/getAllFriends/${userId}`
    );
  //   console.log("response getCommentByPost: ", response.data?.data);
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getAllFriends:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const controlReaction = async (userId, targetType, targetId, reactionType) => {
  try {
    const response = await axiosClient.post(
      `/reactions/controlReaction?userId=${userId}&targetType=${targetType}&targetId=${targetId}&reactionType=${reactionType}`
    );
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API controlReaction:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addComment = async (userId, postId, content) => {
  try {
    const response = await axiosClient.post(
      `/comments/addComment?userId=${userId}&postId=${postId}&content=${content}`
    );
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API addComment:", error.response ? error.response.data : error.message);
    throw error;
  }
};
export const controlActiveStatus = async (postId) => {
  try {
    const response = await axiosClient.put(
      `/posts/controlActiveStatus/${postId}`
    );
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API controlActiveStatusPost:", error.response ? error.response.data : error.message);
    throw error;
  }
};
export const getReactionsByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(
      `/reactions/getByUser/${userId}`
    );
  //   console.log("response getCommentByPost: ", response.data?.data);
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API reactions/getByUser/:", error.response ? error.response.data : error.message);
    throw error;
  }
};
export const update = async (user) => {
  try {
    const response = await axiosClient.put(
      `/users/updateUser`,user
    );
    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API controlActiveStatusPost:", error.response ? error.response.data : error.message);
    throw error;
  }
};