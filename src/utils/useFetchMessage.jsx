import { useState, useEffect } from "react";
import { getUser } from "../services/userService";
import { getMessageList } from "../services/MessageService";

export const useFetchMessages = (senderId, receiverId) => {
    const [messageList, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMessageList(senderId, receiverId);
                setMessages(data);
            } catch (error) {
                console.error("An error occurred:", error.message);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return {messageList, loading, error};
}

export default useFetchMessages;
