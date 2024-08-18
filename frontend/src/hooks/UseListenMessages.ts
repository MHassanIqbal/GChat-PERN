import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import notificationSound from "../assets/sounds/notification.mp3";
import UseConversation from "../zustand/UseConversation";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { messages, setMessages } = UseConversation();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notificationSound);
            sound.play();
            setMessages([...messages, newMessage]);
        });

        return () => {
            socket?.off("newMessage");
        };
    }, [socket, messages, setMessages]);
};
export default useListenMessages;