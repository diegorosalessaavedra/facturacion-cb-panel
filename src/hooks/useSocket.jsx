// src/hooks/useSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_URL_SOCKET); // tu backend
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
}
