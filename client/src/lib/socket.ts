/* eslint-disable @typescript-eslint/no-explicit-any */

import { io, Socket } from "socket.io-client";

export const initializeSocket = (
  onConnect: () => void,
  onPrediction: (data: any) => void,
  onError: (error: any) => void,
  onDisconnect: () => void
): Socket | null => {
  if (!process.env.NEXT_PUBLIC_BACKEND) {
    console.error("WebSocket URL is not set.");
    return null;
  }

  const socket = io(process.env.NEXT_PUBLIC_BACKEND, {
    path: "/socket.io/",
    transports: ["websocket"],
  });

  socket.on("connect", onConnect);
  socket.on("prediction", onPrediction);
  socket.on("error", onError);
  socket.on("disconnect", onDisconnect);

  return socket;
};
