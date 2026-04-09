// src/lib/socket.ts
import { io, Socket } from "socket.io-client";
import storage from "./storage";

export type JobEvents = {
  "job:start": (data: any) => void;
  "job:progress": (data: any) => void;
  "job:completed": (data: any) => void;
  "job:failed": (data: any) => void;
  "events"?: (data: any) => void;
  "action:created": (data: any) => void;
  "computer:initial_state": (data: any) => void;
  "computer:status": (data: any) => void;
};

let socket: Socket<JobEvents> | null = null;
let currentToken: string | null = null;

export function connectEventsSocket() {
  const token: any = storage.get('accessToken');

  // Agar socket mavjud bo'lsa va token o'zgarmagan bo'lsa, mavjud socketni qaytaradi
  if (socket) {
    if (currentToken === token) {
      return socket;
    }
    // Token o'zgargan bo'lsa, eski socketni disconnect qilamiz
    socket.disconnect();
    socket = null;
  }
  
  currentToken = token;

  socket = io("http://139.28.47.17:3703/events", {
    transports: ["websocket", "polling"],
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

  socket.on('connect', () => {
    console.log('✅ Socket ulandi:', socket?.id);
  });

  socket.on("action:created", (data) => {
    console.log(data)
  })

  socket.on('connect_error', (error) => {
    console.error('❌ Ulanish xatosi:', error.message);
  });

  return socket;
}

export function disconnectEventsSocket() {
  // Global socket bo'lgani uchun uni to'liq disconnect qilmaymiz 
  // chunki boshqa page/componentlar (masalan ComputerTracking) ishlashda davom etmoqda.
  // socket?.disconnect();
  // socket = null;
}