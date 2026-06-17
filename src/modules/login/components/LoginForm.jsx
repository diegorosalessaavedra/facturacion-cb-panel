import { Button, Input, Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);

  const submit = (data) => {
    setloading(true);
    const url = `${import.meta.env.VITE_URL_API}/users/login`;

    axios
      .post(url, data)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        const userDataJSON = JSON.stringify(res.data.user);
        localStorage.setItem("userData", userDataJSON);
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        setError(err?.response?.data?.error || "error");
        setloading(false);
      });
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="w-full m-auto p-4 flex flex-col justify-center items-center">
      {loading && (
        // Fondo semi-transparente oscuro con blur para el loading
        <div className="fixed top-0 left-0 z-20 w-screen h-screen bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
          <Spinner
            label="Cargando..."
            color="warning" // Cambiado a warning (ámbar) en NextUI
            size="lg"
            labelColor="warning"
          />
        </div>
      )}
      <form
        // Tarjeta oscura (slate-800), bordes sutiles y sombra difuminada
        className="w-full max-w-[380px]  flex flex-col justify-center items-center gap-6 px-8 py-10 rounded-2xl shadow-2xl shadow-black/60 bg-slate-800 border border-slate-700"
        onSubmit={handleSubmit(submit)}
      >
        <img src={import.meta.env.VITE_LOGO} alt="Logo" className="w-48 mb-2" />

        <div className="w-full flex flex-col items-center justify-center text-center gap-2">
          {/* Texto blanco/slate claro para contrastar con el fondo oscuro */}
          <h1 className="text-xl font-extrabold text-slate-100 tracking-wide">
            INICIAR SESIÓN
          </h1>
        </div>

        <div className="w-full flex flex-col items-center justify-center text-center gap-5">
          <Input
            isRequired
            className="w-full"
            classNames={{
              inputWrapper:
                "min-h-11 bg-slate-900/50 border-1.5 border-slate-600 group-data-[focus=true]:border-amber-500 transition-colors",
              label: "pb-1 text-slate-100 font-semibold",
              input: "text-slate-100 placeholder:text-slate-500",
            }}
            labelPlacement="outside"
            type="email"
            variant="bordered"
            label="Correo"
            placeholder="ejemplo@correo.com"
            {...register("correo", {
              required: "El correo es obligatorio.",
            })}
            isInvalid={!!errors.correo}
            color={errors.correo ? "danger" : "default"}
            errorMessage={errors.correo?.message}
            radius="sm"
            size="md"
            id="correoUsuario"
          />

          {/* Mensaje de error ajustado para que se lea bien en modo oscuro */}
          {error && (
            <span className="text-sm text-red-400 font-medium">{error}</span>
          )}

          <Input
            isRequired
            className="w-full"
            classNames={{
              inputWrapper:
                "min-h-11 bg-slate-900/50 border-1.5 border-slate-600 group-data-[focus=true]:border-amber-500 transition-colors",
              label: "pb-1 text-slate-100 font-semibold",
              input: "text-slate-100 placeholder:text-slate-500",
            }}
            labelPlacement="outside"
            variant="bordered"
            label="Contraseña"
            placeholder="••••••••"
            {...register("password", {
              required: "La contraseña es obligatoria.",
            })}
            isInvalid={!!errors.password}
            color={errors.password ? "danger" : "default"}
            errorMessage={errors.password?.message}
            radius="sm"
            size="md"
            id="passwordUsuario"
            type={isVisible ? "text" : "password"}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  // Iconos en slate-400 que cambian a ámbar al pasar el mouse
                  <FaEyeSlash className="text-xl text-slate-400 hover:text-amber-500 transition-colors flex-shrink-0" />
                ) : (
                  <FaEye className="text-xl text-slate-400 hover:text-amber-500 transition-colors flex-shrink-0" />
                )}
              </button>
            }
          />

          <Button
            // Botón personalizado full ámbar con texto oscuro
            className="w-full bg-amber-500 text-slate-900 font-bold text-md hover:bg-amber-400 shadow-lg shadow-amber-500/20 mt-2"
            size="lg"
            type="submit"
            radius="sm"
          >
            Iniciar Sesión
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
