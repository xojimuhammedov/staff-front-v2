// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

export type JobEvents = {
    "job:start": (data: any) => void;
    "job:progress": (data: any) => void;
    "job:completed": (data: any) => void;
    "job:failed": (data: any) => void;
    // agar server boshqa event bersa:
    "events"?: (data: any) => void;
  };

let socket: Socket<JobEvents> | null = null;

export function connectEventsSocket() {
    if (socket) return socket;

    socket = io("ws://192.168.100.115:3000/events", {
        transports: ["polling", "websocket"], // ✅ eng muhim fix
        upgrade: true,
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 15000,
    });

    return socket;
}

export function disconnectEventsSocket() {
    socket?.disconnect();
    socket = null;
}
