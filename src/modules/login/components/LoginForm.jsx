import { Button, Input, Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
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
    <div className="w-full   m-auto p-4 flex flex-col justify-center items-center">
      {loading && (
        <div className=" fixed top-0 left-0 z-20 w-screen h-screen bg-[#00000094] flex items-center justify-center">
          {" "}
          <Spinner
            label="Cargando..."
            color="success"
            size="lg"
            labelColor="success"
          />
        </div>
      )}
      <form
        className=" w-full max-w-[350px]  flex flex-col justify-center items-center gap-5  px-4 py-10 rounded-xl  shadow-lg shadow-black	bg-white "
        onSubmit={handleSubmit(submit)}
      >
        <img src={import.meta.env.VITE_LOGO} alt="" className="w-48" />
        <div className="w-full  flex flex-col items-center justify-center text-center gap-2">
          <h1 className="text-lg font-bold text-black	">INICIAR SESIÓN</h1>
        </div>
        <div className="w-full  flex flex-col items-center justify-center text-center gap-5">
          <Input
            isRequired
            className="w-full"
            classNames={{
              inputWrapper: "min-h-11 border-1.5 border-neutral-400  ",
              label: "pb-1  text-neutral-800 font-semibold",
            }}
            labelPlacement="outside"
            type="email"
            variant="bordered"
            label="Correo"
            placeholder="..."
            {...register("correo", {
              required: "El correo es obligatorio.",
            })}
            isInvalid={!!errors.correo}
            color={errors.correo ? "danger" : "primary"}
            errorMessage={errors.correo?.message}
            radius="sm"
            size="md"
            id="correoUsuario"
          />
          {error && <span className="text-sm text-red-600">{error}</span>}
          <Input
            isRequired
            className="w-full"
            classNames={{
              inputWrapper: "min-h-11 border-1.5 border-neutral-400",
              label: "pb-1  text-neutral-800 font-semibold",
            }}
            labelPlacement="outside"
            variant="bordered"
            label="Contraseña"
            placeholder="..."
            {...register("password", {
              required: "La contraseña es obligatorio.",
            })}
            isInvalid={!!errors.password}
            color={errors.password ? "danger" : "primary"}
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
                  <FaEyeSlash className="text-2xl text-blue-600 pointer-events-none flex-shrink-0" />
                ) : (
                  <FaEye className="text-2xl text-blue-600 pointer-events-none flex-shrink-0" />
                )}
              </button>
            }
          />
          <Button color="primary" size="lg" type="submit">
            Iniciar Sesion
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
