import React from "react";
import { Divider } from "@nextui-org/react";
import FormNuevaOrdenCompra from "./components/FormNuevaOrdenCompra";

const NuevaOrdenCompra = ({ userData }) => {
  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 px-6 rounded-md overflow-auto">
        <div className="w-full flex px-10 py-6 gap-10 items-center">
          <img className="w-32 h-28" src={import.meta.env.VITE_LOGO} alt="" />
          <div className="flex flex-col ">
            <h1 className="text-sm font-bold">SOLPED</h1>
            <h2 className="text-sm font-bold">OC-XXX</h2>
            <h2 className="text-sm font-bold">{import.meta.env.VITE_NOMBRE}</h2>
            <ul>
              <li className="text-stone-400 text-xs font-medium">
                {import.meta.env.VITE_DIRRECION}{" "}
              </li>
              <li className="text-stone-400 text-xs font-medium">
                {import.meta.env.VITE_CORREO} - {import.meta.env.VITE_TELEFONO}
              </li>
            </ul>
          </div>
        </div>
        <Divider className="bg-neutral-200 h-[2px] mt-[-15px]" />
        <FormNuevaOrdenCompra userData={userData} />
      </div>
    </div>
  );
};

export default NuevaOrdenCompra;
