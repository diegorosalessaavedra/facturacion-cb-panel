import React, { useState, useCallback } from "react";
import GrupoColaboradorAdministrativo from "./GrupoColaboradorAdministrativo";
import TablaTotalesAsistenciaAdministrativos from "./TablaTotalesAsistenciaAdministrativos";

const TablaAsistenciaAdministrativos = ({
  findColaborador,
  dias,
  totalSemanas,
}) => {
  const [sumasCalculadas, setSumasCalculadas] = useState({
    salario: 0,
    adicionales: 0,
    topeSemanal: 0,
  });

  // Solución: useCallback estabiliza la referencia de la función.
  // La validación interna corta cualquier bucle infinito deteniendo el re-render
  // si el resultado es idéntico al anterior.
  const handleTotalesCalculados = useCallback(
    (salario, adicionales, topeSemanal) => {
      setSumasCalculadas((prev) => {
        if (
          prev.salario === salario &&
          prev.adicionales === adicionales &&
          prev.topeSemanal === topeSemanal
        ) {
          return prev; // Si los datos son iguales, aborta la actualización (rompe el bucle)
        }
        return { salario, adicionales, topeSemanal };
      });
    },
    [],
  );

  const thMainBlue =
    "bg-sky-900 border-r border-b border-sky-950 p-2.5 font-bold uppercase text-[10px] tracking-widest text-white";
  const thMainGreen =
    "bg-teal-800 border-r border-b border-teal-900 p-2.5 font-bold uppercase text-[10px] tracking-widest text-white";
  const thMainYellow =
    "bg-amber-700 border-b border-amber-800 p-2.5 font-bold uppercase text-[10px] tracking-widest text-white";

  const thSubBlue =
    "bg-sky-100 border-r border-b border-sky-300 p-3 font-bold uppercase text-[9px] tracking-wider text-blue-950 whitespace-nowrap";
  const thSubGreen =
    "bg-teal-100 border-r border-b border-teal-300 p-3 font-bold uppercase text-[9px] tracking-wider text-teal-950 whitespace-nowrap";
  const thSubYellow =
    "bg-amber-100 border-r border-b border-amber-300 p-3 font-bold uppercase text-[9px] tracking-wider text-amber-950 whitespace-nowrap";
  const thSubYellowLast =
    "bg-amber-100 border-b border-amber-300 p-3 font-bold uppercase text-[9px] tracking-wider text-amber-950 whitespace-nowrap";

  return (
    <div className="flex flex-col  gap-6 items-start mt-4">
      {/* TABLA GRANDE (Izquierda) */}
      <div className="flex overflow-auto border border-slate-300 rounded-xl bg-white shadow-md custom-scrollbar w-full">
        <table className="w-full border-collapse text-center">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr>
              <th colSpan={13} className={thMainBlue}>
                DATOS DE ENTRADA Y SALIDA
              </th>
              <th colSpan={6} className={thMainGreen}>
                CÁLCULOS
              </th>
              <th colSpan={2} className={thMainYellow}>
                SUBTOTALES
              </th>
            </tr>
            <tr>
              <th className={thSubBlue}>COLABORADOR</th>
              <th className={thSubBlue}>DÍA</th>
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

          <GrupoColaboradorAdministrativo
            colaborador={findColaborador}
            dias={dias}
            totalSemanas={totalSemanas}
            onTotalesCalculados={handleTotalesCalculados}
          />
        </table>
      </div>

      {/* TABLA PEQUEÑA DE TOTALES (Derecha) */}
      <div className="shrink-0 w-full xl:w-auto overflow-x-auto shadow-md">
        <TablaTotalesAsistenciaAdministrativos
          semanaPlanillaId={dias?.[0]?.semana_plantilla_id}
          colaboradorId={findColaborador?.id}
          salarioBase={sumasCalculadas.salario}
          adicionalesBase={sumasCalculadas.adicionales}
          salarioTope={sumasCalculadas.topeSemanal}
        />
      </div>
    </div>
  );
};

export default TablaAsistenciaAdministrativos;
