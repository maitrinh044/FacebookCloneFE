import { useState, useEffect } from "react";
import { getUserFriends } from "../services/userService";

export const useFetchUserFriends = () => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserFriends();
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