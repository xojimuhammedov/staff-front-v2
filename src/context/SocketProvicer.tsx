import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

interface Props {
    token: string;
    url: string;
    children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ token, url, children }) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!token || !url) return;

        // socketni faqat bir marta ulaymiz
        const socketInstance = io(url, {
            extraHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        socketRef.current = socketInstance;

        // sahifa yopilganda disconnect bo‘ladi
        return () => {
            socketInstance.disconnect();
        };
    }, [url, token]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current }}>
            {children}
        </SocketContext.Provider>
    );
};


export const useSocket = () => {
    const { socket } = useContext(SocketContext);
    return socket;
};