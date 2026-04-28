// src/context/SocketContext.jsx
import { createContext, useContext } from "react";
import useSocket from "../hooks/useSocket";

// En JavaScript puro, solo pasamos el valor inicial (null)
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useSocket(); // Se crea SOLO UNA VEZ y se comparte en toda la app

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
