import axiosClient from "../utils/axiosClient";

export const uploadMedia = async (mediaFile, userId) => {
  try {
    const formData = new FormData();
    formData.append("file", mediaFile);
    formData.append("userId", userId);

    const response = await axiosClient.post(`/media/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("api response: ", response.data.data.url);

    return response.data?.data;
  } catch (error) {
    console.error("Lỗi khi gọi API upload media:", error.response ? error.response.data : error.message);
    throw error;
  }
};
