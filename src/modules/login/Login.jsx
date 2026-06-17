import React, { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { useNavigate } from "react-router-dom";

const Login = ({ userData }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      navigate("/");
    }
  }, [userData, navigate]);

  return (
    // Agregamos bg-slate-900 y centramos el contenido
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900">
      <LoginForm />
    </div>
  );
};

export default Login;
