import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (socket) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        const newSocket = io(`${import.meta.env.VITE_STATIC_BACKEND_URL}`, {
            auth: { token },
            // autoConnect: false
        });

        setSocket(newSocket);

        newSocket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, []);

    return socket;
}
