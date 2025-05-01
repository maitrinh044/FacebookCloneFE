import axiosClient from "../utils/axiosClient";

export const getReactions = async (targetType, targetId) => {
  try {
    const response = await axiosClient.get(`/reactions/${targetType}/${targetId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching reactions:', error);
    throw error;
  }
};

export const toggleReaction = async (reactionData) => {
  try {
    const response = await axiosClient.post(`/reactions/toggle`, reactionData);
    return response.data;
  } catch (error) {
    console.error('Error toggling reaction:', error);
    throw error;
  }
};

export const countReactions = async (targetType, targetId) => {
  try {
    const response = await axiosClient.get(`/reactions/count/${targetType}/${targetId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error counting reactions:', error);
    throw error;
  }
};

export const countReactionsByType = async (targetType, targetId, reactionType) => {
  try {
    const response = await axiosClient.get(`/reactions/count/${targetType}/${targetId}/${reactionType}`);
    return response.data.data;
  } catch (error) {
    console.error('Error counting reactions by type:', error);
    throw error;
  }
};

// New function to fetch available reaction types
export const getReactionTypes = async () => {
  try {
    const response = await axiosClient.get(`/reactions/types`);
    return response.data.data; // Expecting [{ id, emoji, label }, ...]
  } catch (error) {
    console.error('Error fetching reaction types:', error);
    return [
      { id: "LIKE", emoji: "👍", label: "Thích" },
      { id: "LOVE", emoji: "❤️", label: "Yêu thích" },
      { id: "HAHA", emoji: "😆", label: "Haha" },
      { id: "WOW", emoji: "😮", label: "Wow" },
      { id: "SAD", emoji: "😢", label: "Buồn" },
      { id: "ANGRY", emoji: "😡", label: "Phẫn nộ" },
    ]; // Fallback to static types
  }
};