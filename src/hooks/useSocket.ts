import { useEffect, useRef } from "react";
import { connectEventsSocket, disconnectEventsSocket, JobEvents } from "services/socket";
import type { Socket } from "socket.io-client";

type DonePayload =
    | { status: "completed"; data: any }
    | { status: "failed"; data: any };

export function useEventsSocket(params: {
    jobId?: string | number;
    onDone: (payload: DonePayload) => void;
    onProgress?: (data: any) => void;
    onStart?: (data: any) => void;
    onError?: (message: string) => void;
}) {
    const { jobId, onDone, onProgress, onStart, onError } = params;

    const socketRef = useRef<Socket<JobEvents> | null>(null);
    const doneRef = useRef(false);

    useEffect(() => {
        if (!jobId) return;

        doneRef.current = false;

        const socket = connectEventsSocket();
        socketRef.current = socket;

        const isSameJob = (data: any) => String(data?.jobId) === String(jobId);

        const handleConnect = () => {
            console.log("✅ Socket connected:", socket.id);
        };

        const handleDisconnect = () => {
            console.log("❌ Socket disconnected");
        };

        const handleConnectError = (err: any) => {
            const msg = err?.message ?? "socket connect_error";
            console.error("Socket connect_error:", msg);
            onError?.(msg);
        };

        const handleStart = (data: any) => {
            if (!isSameJob(data)) return;
            onStart?.(data);
            console.log("job:start", data);
        };

        const handleProgress = (data: any) => {
            if (!isSameJob(data)) return;
            onProgress?.(data);
            console.log("job:progress", data);
        };

        const finishOnce = (payload: DonePayload) => {
            if (doneRef.current) return;
            doneRef.current = true;
            onDone(payload);

            // ✅ job tugashi bilan socket tozalash
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("job:start", handleStart);
            socket.off("job:progress", handleProgress);
            socket.off("job:completed", handleCompleted);
            socket.off("job:failed", handleFailed);

            disconnectEventsSocket();
            socketRef.current = null;
        };

        const handleCompleted = (data: any) => {
            if (!isSameJob(data)) return;
            console.log("job:completed", data);
            finishOnce({ status: "completed", data });
        };

        const handleFailed = (data: any) => {
            if (!isSameJob(data)) return;
            console.log("job:failed", data);
            finishOnce({ status: "failed", data });
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);

        socket.on("job:start", handleStart);
        socket.on("job:progress", handleProgress);
        socket.on("job:completed", handleCompleted);
        socket.on("job:failed", handleFailed);

        return () => {
            // component unmount bo‘lsa
            socket.off();
            disconnectEventsSocket();
            socketRef.current = null;
        };
    }, [jobId, onDone, onProgress, onStart, onError]);
}
