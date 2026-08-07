import React from "react";
import TrAsistenciaOperativo from "./TrAsistenciaOperativo";

const TablaAsistenciasOperativos = ({ dias, findColaborador }) => {
  return (
    <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm mt-4 custom-scrollbar">
      <table className="w-full border-collapse text-center">
        <thead className="sticky top-0 bg-slate-900 z-10 shadow-md">
          <tr>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              COLABORADOR
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              HORA ENTRADA
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              HORA SALIDA
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 min-w-[140px]">
              FUNCION DEL DIA
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200">
              VACACIONES
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200">
              FERIADO
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200">
              H. LABORADAS
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200">
              H. PARA TURNOS
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200">
              TARDANZA (Min)
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200">
              ESTADO
            </th>
            <th className="p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200">
              ACCIONES
            </th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {!dias || dias.length === 0 ? (
            <tr>
              <td
                colSpan={11} // CORREGIDO: De 3 a 11 columnas
                className="text-center p-8 text-slate-500 bg-slate-50 text-sm font-medium"
              >
                No hay semanas registradas.
              </td>
            </tr>
          ) : (
            dias.map((dia) => (
              <TrAsistenciaOperativo
                key={dia.id}
                dia={dia}
                findColaborador={findColaborador}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaAsistenciasOperativos;
