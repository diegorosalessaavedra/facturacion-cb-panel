import React from "react";
import GrupoColaboradorAdministrativo from "./GrupoColaboradorAdministrativo";

const TablaAsistenciaAdministrativos = ({ findColaborador, dias }) => {
  // Los estilos corporativos de los encabezados
  const thMainBlue =
    "bg-blue-900 border-r border-b border-blue-950 p-2.5 font-bold uppercase text-[10px] tracking-widest text-white";
  const thMainGreen =
    "bg-teal-800 border-r border-b border-teal-900 p-2.5 font-bold uppercase text-[10px] tracking-widest text-white";
  const thMainYellow =
    "bg-amber-700 border-b border-amber-800 p-2.5 font-bold uppercase text-[10px] tracking-widest text-white";

  const thSubBlue =
    "bg-blue-100 border-r border-b border-blue-300 p-3 font-bold uppercase text-[9px] tracking-wider text-blue-950 whitespace-nowrap";
  const thSubGreen =
    "bg-teal-100 border-r border-b border-teal-300 p-3 font-bold uppercase text-[9px] tracking-wider text-teal-950 whitespace-nowrap";
  const thSubYellow =
    "bg-amber-100 border-r border-b border-amber-300 p-3 font-bold uppercase text-[9px] tracking-wider text-amber-950 whitespace-nowrap";
  const thSubYellowLast =
    "bg-amber-100 border-b border-amber-300 p-3 font-bold uppercase text-[9px] tracking-wider text-amber-950 whitespace-nowrap";

  return (
    <div className="flex-1 overflow-auto border border-slate-300 rounded-xl bg-white shadow-md mt-4 custom-scrollbar">
      <table className="w-full border-collapse text-center">
        <thead className="sticky top-0 z-20 shadow-sm">
          {/* PRIMER NIVEL */}
          <tr>
            <th colSpan={12} className={thMainBlue}>
              DATOS DE ENTRADA Y SALIDA
            </th>
            <th colSpan={6} className={thMainGreen}>
              CÁLCULOS
            </th>
            <th colSpan={2} className={thMainYellow}>
              SUBTOTALES
            </th>
          </tr>
          {/* SEGUNDO NIVEL */}
          <tr>
            <th className={thSubBlue}>COLABORADOR</th>
            <th className={thSubBlue}>FERIADO</th>
            <th className={thSubBlue}>GOCE VACACIONES</th>
            <th className={thSubBlue}>TURNO</th>
            <th className={thSubBlue}>ACTIVIDAD</th>
            <th className={thSubBlue}>ENTRADA</th>
            <th className={thSubBlue}>SALIDA</th>
            <th className={thSubBlue}>TARDANZA (Min)</th>
            <th className={thSubBlue}>TOTAL HR Y MIN</th>
            <th className={thSubBlue}>HORAS ENTERAS</th>
            <th className={thSubBlue}>MINUTOS ENTERAS</th>
            <th className={thSubBlue}>TURNOS</th>
            <th className={thSubGreen}>TOTAL PLANILLA</th>
            <th className={thSubGreen}>HR Y MIN EXTRA</th>
            <th className={thSubGreen}>IMPORTE HORAS</th>
            <th className={thSubGreen}>IMPORTE MINUTOS</th>
            <th className={thSubGreen}>BONO</th>
            <th className={thSubGreen}>FERIADO</th>
            <th className={thSubYellow}>SALARIO</th>
            <th className={thSubYellowLast}>ADICIONALES</th>
          </tr>
        </thead>

        {/* Renderizamos un <tbody> por cada colaborador */}

        <GrupoColaboradorAdministrativo
          colaborador={findColaborador}
          dias={dias}
        />
      </table>
    </div>
  );
};

export default TablaAsistenciaAdministrativos;
