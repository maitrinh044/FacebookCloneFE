const API_URL = "http://localhost:8080";

export const getReactionTypes = async () => {
    const response = await fetch(`${API_URL}/reactions/types`);
    const data = await response.json();
    if (data.statusCode !== 200) throw new Error(data.message || "Không thể tải loại phản ứng");
    return data.data;
};

export const toggleReaction = async (reaction, userId) => {
    if (!userId) throw new Error("User ID is required");
    const response = await fetch(`${API_URL}/reactions/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            type: reaction.reactionType,
            targetType: reaction.targetType,
            targetId: reaction.targetId,
            userId: userId,
        }),
    });
    const data = await response.json();
    if (data.statusCode !== 200) throw new Error(data.message || "Không thể thực hiện phản ứng");
    return data.data;
};

export const countReactions = async (targetType, targetId) => {
    const response = await fetch(`${API_URL}/reactions/count/${targetType}/${targetId}`);
    const data = await response.json();
    if (data.statusCode !== 200) throw new Error(data.message || "Không thể đếm phản ứng");
    return data.data;
};

export const getReactions = async (targetType, targetId, userId = null) => {
    const response = await fetch(`${API_URL}/reactions/${targetType}/${targetId}`);
    const data = await response.json();
    if (data.statusCode !== 200) throw new Error(data.message || "Không thể tải phản ứng");
    if (userId) {
        return data.data.find(reaction => reaction.userId === userId) || null;
    }
    return data.data;
};

export const getReactionCountsByType = async (targetType, targetId) => {
    const reactionTypes = ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"];
    const counts = {};
    for (const type of reactionTypes) {
        const response = await fetch(`${API_URL}/reactions/count/${targetType}/${targetId}/${type}`);
        const data = await response.json();
        if (data.statusCode === 200) {
            counts[type] = data.data;
        } else {
            counts[type] = 0;
        }
    }
    return counts;
};