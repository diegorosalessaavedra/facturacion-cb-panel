import React from "react";
import FormCrearCotizacion from "./components/FormCrearCotizacion/FormCrearCotizacion";
import { Divider } from "@nextui-org/react";
import SectionUnoCrearCotizacion from "./components/SectionUnoCrearCotizacion";

const CrearCotizacion = ({ userData }) => {
  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      <div className="w-full  bg-white flex flex-col gap-4 px-6 rounded-md ">
        <SectionUnoCrearCotizacion />
        <Divider className="bg-neutral-200 h-[2px] mt-[-15px]" />
        <FormCrearCotizacion userData={userData} />
      </div>
    </div>
  );
};

export default CrearCotizacion;
