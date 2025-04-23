import { useState, useEffect } from "react";
import { getUser } from "../services/UserService";
import { useFetcher } from "react-router-dom";

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

export default useFetchUser;
