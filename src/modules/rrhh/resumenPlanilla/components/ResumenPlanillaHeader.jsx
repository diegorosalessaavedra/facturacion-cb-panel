import React from "react";
import { Chip } from "@nextui-org/react";
import { FaCalendarAlt, FaCircle } from "react-icons/fa";

const ResumenPlanillaHeader = ({ dataSemana }) => {
  return (
    <header className="relative w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden">
      {/* Brillo sutil de fondo para darle un toque moderno (opcional) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="flex items-center gap-5 relative z-10 w-full">
        {/* Contenedor del Logo */}
        <div className="bg-white p-2.5 rounded-xl shadow-sm shrink-0">
          <img
            className="w-12 h-12 object-contain"
            src="/logo.jpg"
            alt="Logo Empresa"
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-slate-50 tracking-tight">
              Resumen Planilla
            </h1>

            {/* Chips para destacar la fecha dinámicamente */}
            {dataSemana && (
              <div className="flex items-center gap-2">
                <Chip
                  startContent={
                    <FaCalendarAlt className="text-slate-900" size={10} />
                  }
                  variant="flat"
                  size="sm"
                  className="bg-green-500 font-semibold tracking-wide text-slate-900 px-2 gap-0.5"
                >
                  Semana {dataSemana.numero_semana}
                </Chip>
                <Chip
                  variant="dot"
                  size="sm"
                  startContent={
                    <FaCircle className="text-slate-900" size={6} />
                  }
                  className="bg-amber-500 text-slate-900 border-none px-2 gap-0.5  "
                >
                  {dataSemana.mes_planilla?.mes} -{" "}
                  {dataSemana.year_planilla?.year}
                </Chip>
              </div>
            )}
          </div>

          <p className="text-slate-400 text-sm font-medium">
            Filtra y selecciona una semana para ingresar a la plantilla de la
            planilla.
          </p>
        </div>
      </div>
    </header>
  );
};

export default ResumenPlanillaHeader;
