import { useEffect, useState } from "react";
import { addComment, controlActiveStatus, controlReaction, getCommentByPost, getFriendsByUserId, getPostByUser, getReactionByPostId, getReactionsByUserId, getUserById, update } from "../services/profileService";
import { getReactionTypes } from "../services/ReactionService";
import React from 'react';

export const useFetchProfile = (userId, currentUserId) => {
    const [listPost, setListPost] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reactionByPost, setReactionByPost] = useState([]);
    const [commentByPost, setCommentByPost] = useState([]);
    const [reactionTypes, setReactionTypes] = useState([]);
    const [listFriends, setListFriends] = useState([]);
    const [reactionByUser, setReactionByUser] = useState([]);

    const fetchReactionTypes = async () => {
        try {
        const types = await getReactionTypes();
        setReactionTypes(types);
        } catch (err) {
        console.error("Failed to fetch reaction types:", err);
        }
    };

    const fetchListFriends = async () => {
        try {
            const friends = await getFriendsByUserId(userId);
            setListFriends(friends);
            } catch (err) {
            console.error("Failed to fetch list friends by user:", err);
            }
    }

    const fetchReactionByCurrentUser = async () => {
        try {
            const data = await getReactionsByUserId(currentUserId); // Lấy người dùng bằng ID
            setReactionByUser(data);
        } catch (error) {
            console.error("Error while getting reaction by userid:", error);
        }
    }

    const fetchPostByUser = async () => {
        try {
            setLoading(true);
            const response1 = await getPostByUser(userId);
            setListPost(response1); // Đảm bảo dữ liệu có trả về từ API

            const response2 = await getUserById(userId);
            if (response2) {2
                setUserData(response2);
            }
            // Tạo mảng các Promise cho reactions
            const reactionPromises = response1.map(post1 => {
                return getReactionByPostId(post1.id).then(reactions => ({
                    postId: post1.id,
                    reactions
                }));
            });
            // Chờ cho tất cả các yêu cầu reactions hoàn thành
            const tmp1 = await Promise.all(reactionPromises);
            setReactionByPost(tmp1);

            const commentPromises = response1.map(post => {
                return getCommentByPost(post.id).then(comments => ({
                    postId: post.id,
                    comments
                }));
            });
            const tmp2 = await Promise.all(commentPromises);
            setCommentByPost(tmp2);

            return [response1, response2]; // Trả về dữ liệu để sử dụng trong refetch
        } catch (error) {
            console.error("Lỗi khi lấy thông tin của user:", error.response ? error.response.data : error.message);
            return []; // Hoặc trả về mảng rỗng nếu có lỗi
        } finally {
            setLoading(false);
        }
    };

    const controlReactionUser = async (userId, targetType, targetId, reactionType) => {
        try {
            const newReaction = await controlReaction(userId, targetType, targetId, reactionType);
            
            const data = await getReactionsByUserId(currentUserId); // Lấy người dùng bằng ID
            setReactionByUser(data);
            const tmp2 = await getReactionByPostId(post.id);
            setReactionByPost(tmp2);
        } catch (error) {
            const data = await getReactionsByUserId(currentUserId); // Lấy người dùng bằng ID
            setReactionByUser(data);
            console.error("Lỗi khi điều khiển phản ứng:", error);
        }
    };

    const addCommentByUser = async (userId, postId, content) => {
        try {
            // Gọi API để thêm bình luận
            const response = await addComment(userId, postId, content); 
            // Cập nhật danh sách bình luận nếu cần

            const updatedComments = await getCommentByPost(postId); // Lấy lại bình luận
            setCommentByPost(prev => 
                prev.map(item => item.postId === postId ? { postId, comments: updatedComments } : item)
            );
        } catch (error) {
            console.error("Lỗi khi thêm bình luận:", error);
        }
    };
// mai sua tiep nha 
    const controlActiveStatusPost = async (userId, postId) => {
        try {
            const response = await controlActiveStatus(postId); 

            const updatedComments = await getPostByUser(userId);
            setListPost(updatedComments);
        } catch (error) {
            console.error("Lỗi khi điều chỉnh bài viết:", error);
        }
    }

    const updateUser = async (user) => {
        try {
            const response = await update(user);
            const updateProfile = await getUserById(userId);
            if (updateProfile) {
                setUserData(updateProfile);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật profile:", error);
        }
    }

    useEffect(() => {
        if (userId) {
            fetchPostByUser();
            fetchReactionTypes();
            fetchListFriends();
            fetchReactionByCurrentUser();
        }
    }, [userId, currentUserId]); // Đặt userId vào mảng phụ thuộc

    return {
        listPost,
        userData,
        reactionByPost,
        commentByPost,
        reactionTypes,
        listFriends,
        controlReactionUser,
        addCommentByUser,
        reactionByUser,
        loading,
        controlActiveStatusPost,
        updateUser,
        refetch: fetchPostByUser,
    };
}
export const getReactionsByUser = (userId) => {
    const [reactionByUser, setReactionByUser] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getReactionsByUserId(userId); // Lấy người dùng bằng ID
                setReactionByUser(data);
            } catch (error) {
                console.error("Error while getting reaction by userid:", error);
            }
        };
        fetchData();
    }, [userId]);

    return { reactionByUser };
};
export default useFetchProfile;