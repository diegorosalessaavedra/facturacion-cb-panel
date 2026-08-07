import React from "react";
import { Button } from "@nextui-org/react";
import { FiPlus } from "react-icons/fi";

const ResumenPlanillaHeader = ({}) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full bg-slate-900 border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-6 relative z-10">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img
            className="w-12 h-12 object-contain"
            src="/logo.jpg"
            alt="logo"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-50 tracking-tight flex items-center gap-2">
            RESUMEN PLANILLA
          </h1>
          <p className="text-slate-200 text-sm">
            Filtra y selecciona una semana para ingregar a la plantilla de la
            planilla{" "}
          </p>
        </div>
      </div>
    </header>
  );
};

export default ResumenPlanillaHeader;
