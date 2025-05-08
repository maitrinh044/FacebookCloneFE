import axiosClient from "../utils/axiosClient";
import { getLocalISOStringWithoutMs } from "../utils/dateUtil";

export const getReactionTypes = async () => {
    return [
      { id: "LIKE", emoji: "👍", label: "Thích" },
      { id: "LOVE", emoji: "❤️", label: "Yêu thích" },
      { id: "HAHA", emoji: "😆", label: "Haha" },
      { id: "WOW", emoji: "😮", label: "Wow" },
      { id: "SAD", emoji: "😢", label: "Buồn" },
      { id: "ANGRY", emoji: "😡", label: "Phẫn nộ" },
    ];
};

export const toggleReaction = async (reaction, userId) => {
  if (!userId) throw new Error("User ID is required");
  try {
    const response = await axiosClient.post("/reactions/toggle", {
      type: reaction.reactionType,
      targetType: reaction.targetType,
      targetId: reaction.targetId,
      userId: userId,
      time: getLocalISOStringWithoutMs() // Thêm thời gian phản ứng
    });
    return response.data.data || null;
  } catch (error) {
    console.error("Error toggling reaction:", error);
    throw error;
  }
};

export const countReactions = async (targetType, targetId) => {
  try {
    const response = await axiosClient.get(`/reactions/count/${targetType}/${targetId}`);
    return response.data.data || 0;
  } catch (error) {
    console.error("Error counting reactions:", error);
    return 0;
  }
};

export const getReactions = async (targetType, targetId, userId = null) => {
  try {
    const response = await axiosClient.get(`/reactions/${targetType}/${targetId}`);
    const reactions = response.data.data || [];
    if (userId) {
      return reactions.find(reaction => reaction.userId === userId) || null;
    }
    return reactions;
  } catch (error) {
    console.error("Error getting reactions:", error);
    return userId ? null : [];
  }
};

export const getReactionCountsByType = async (targetType, targetId) => {
  const reactionTypes = ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"];
  const counts = {};
  
  try {
    // Sử dụng Promise.all để gọi song song các API
    const promises = reactionTypes.map(type => 
      axiosClient.get(`/reactions/count/${targetType}/${targetId}/${type}`)
        .then(response => ({ type, count: response.data.data || 0 }))
        .catch(() => ({ type, count: 0 }))
    );

    const results = await Promise.all(promises);
    results.forEach(({ type, count }) => {
      counts[type] = count;
    });

    return counts;
  } catch (error) {
    console.error("Error getting reaction counts by type:", error);
    // Trả về object với tất cả reaction types có giá trị 0 nếu có lỗi
    return reactionTypes.reduce((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {});
  }
};