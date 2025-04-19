import { useState, useEffect } from "react";
import { getUserFriends } from "../services/UserService";

export const useFetchUserFriends = () => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserFriends(userId);
                setFriends(data);
            } catch (error) {
                console.error("An error occurred:", error.message);
                setFriends([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return {friends, loading, error};
}

export default useFetchUserFriends;