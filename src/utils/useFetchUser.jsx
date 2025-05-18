import { useState, useEffect } from "react";
import { getUserById } from "../services/profileService";
export const useFetchUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUser();
                setUsers(data);
            } catch (error) {
                console.error("An error occurred:", error.message);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return {users, loading, error};
}

export const useFetchUserById = (userId) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserById(userId); // Lấy người dùng bằng ID
                // console.log("Data: ", data);
                setUser(data);
            } catch (error) {
                console.error("Error while getting user by id:", error);
                setError(error); // Cập nhật lỗi ở đây
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    return { user, loading, error };
};