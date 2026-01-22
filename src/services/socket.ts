// src/lib/socket.ts
import { io, Socket } from "socket.io-client";
import storage from "./storage";

export type JobEvents = {
    "job:start": (data: any) => void;
    "job:progress": (data: any) => void;
    "job:completed": (data: any) => void;
    "job:failed": (data: any) => void;
    "events"?: (data: any) => void;
  };
let socket: Socket<JobEvents> | null = null;

export function connectEventsSocket() {
    const token = storage.get('accessToken');
    
    // Agar socket mavjud bo'lsa va token o'zgarmagan bo'lsa, mavjud socketni qaytaradi
    if (socket && socket.connected) {
        return socket;
    }

    // Agar socket mavjud bo'lsa lekin token o'zgargansa, eski socketni disconnect qiladi
    if (socket) {
        socket.disconnect();
        socket = null;
    }

    socket = io("ws://139.28.47.17:3703/events", {
        transports: ["polling", "websocket"],
        upgrade: true,
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 15000,
        auth: {
            token: token || undefined,
        },
        extraHeaders: token ? {
            Authorization: `Bearer ${token}`,
        } : {},
    });

    return socket;
}

export function disconnectEventsSocket() {
    socket?.disconnect();
    socket = null;
}