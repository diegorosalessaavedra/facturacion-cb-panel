// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <NextUIProvider className="w-screen h-screen flex bg-white overflow-hidden">
        <SocketProvider>
          <App />
        </SocketProvider>
      </NextUIProvider>
    </BrowserRouter>
  </React.StrictMode>
);
