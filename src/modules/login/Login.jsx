import React, { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { useNavigate } from "react-router-dom";

const Login = ({ userData }) => {
  const navigate = useNavigate(); // Aquí faltaba ejecutar la función con ()

  useEffect(() => {
    if (userData) {
      navigate("/");
    }
  }, [userData, navigate]);
  return (
    <div className="w-full h-screen flex flex-col">
      <LoginForm />
    </div>
  );
};

export default Login;
