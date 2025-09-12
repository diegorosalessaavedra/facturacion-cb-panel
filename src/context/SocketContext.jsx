// src/context/SocketContext.jsx
import { createContext, useContext } from "react";
import useSocket from "../hooks/useSocket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useSocket(); // aquí se crea SOLO UNA VEZ

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
