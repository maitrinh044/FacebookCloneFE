import axiosClient from "../utils/axiosClient";

// Lấy tất cả thông báo
export const getAllNotifications = async () => {
  try {
    const response = await axiosClient.get('/notification/getAllNotifications');
    console.log("API Response - getAllNotifications:", response.data);
    const data = response.data?.data || [];
    if (!Array.isArray(data)) {
      console.warn("getAllNotifications: Expected array but got:", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API getAllNotifications:", error.response || error);
    throw new Error(`Lỗi khi lấy danh sách thông báo: ${error.response?.data?.message || error.message}`);
  }
};

// Lấy thông báo theo ID
export const getNotificationById = async (notificationId) => {
  try {
    if (!notificationId || isNaN(parseInt(notificationId))) {
      console.error("getNotificationById: Invalid notificationId:", notificationId);
      throw new Error("ID thông báo không hợp lệ");
    }
    const response = await axiosClient.get(`/notification/getNotificationById/${notificationId}`);
    console.log("API Response - getNotificationById:", response.data);
    return response.data?.data || null;
  } catch (error) {
    console.error("Lỗi khi gọi API getNotificationById:", error.response || error);
    throw new Error(`Lỗi khi lấy thông tin thông báo: ${error.response?.data?.message || error.message}`);
  }
};

// Tạo thông báo mới
export const createNotification = async (notificationData) => {
  try {
    if (!notificationData || !notificationData.userId?.id || !notificationData.content || !notificationData.type) {
      console.error("createNotification: Invalid notificationData:", notificationData);
      throw new Error("Dữ liệu thông báo không hợp lệ");
    }
    const payload = {
      ...notificationData,
      isRead: notificationData.isRead || false,
      createdAt: notificationData.createdAt || new Date().toISOString(),
    };
    console.log("Sending notificationData to API:", JSON.stringify(payload, null, 2));
    const response = await axiosClient.post('/notification/createNotification', payload);
    console.log("API Response - createNotification:", response.data);
    return response.data?.data || null;
  } catch (error) {
    console.error("Lỗi khi gọi API createNotification:", error.response || error);
    throw new Error(`Lỗi khi tạo thông báo: ${error.response?.data?.message || error.message}`);
  }
};

// Cập nhật thông báo (ví dụ: đánh dấu đã đọc)
export const updateNotification = async (notificationId, notificationData) => {
  try {
    if (!notificationId || isNaN(parseInt(notificationId)) || !notificationData) {
      console.error("updateNotification: Invalid notificationId or data:", { notificationId, notificationData });
      throw new Error("Dữ liệu cập nhật thông báo không hợp lệ");
    }
    const payload = {
      ...notificationData,
      isRead: notificationData.isRead !== undefined ? notificationData.isRead : false,
    };
    console.log("Updating notificationData:", JSON.stringify(payload, null, 2));
    const response = await axiosClient.put(`/notification/updateNotification/${notificationId}`, payload);
    console.log("API Response - updateNotification:", response.data);
    return response.data?.data || null;
  } catch (error) {
    console.error("Lỗi khi gọi API updateNotification:", error.response || error);
    throw new Error(`Lỗi khi cập nhật thông báo: ${error.response?.data?.message || error.message}`);
  }
};

// Xóa thông báo
export const deleteNotification = async (notificationId) => {
  try {
    if (!notificationId || isNaN(parseInt(notificationId))) {
      console.error("deleteNotification: Invalid notificationId:", notificationId);
      throw new Error("ID thông báo không hợp lệ");
    }
    const response = await axiosClient.delete(`/notification/deleteNotification/${notificationId}`);
    console.log("API Response - deleteNotification:", response.data);
    return response.data?.data || true;
  } catch (error) {
    console.error("Lỗi khi gọi API deleteNotification:", error.response || error);
    throw new Error(`Lỗi khi xóa thông báo: ${error.response?.data?.message || error.message}`);
  }
};