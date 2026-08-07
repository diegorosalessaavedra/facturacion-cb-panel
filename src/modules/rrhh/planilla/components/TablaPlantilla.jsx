import { Button } from "@nextui-org/react";
import React from "react";
import { Link } from "react-router-dom";

const TablaPlantilla = ({
  selectYear,
  yearPlanillas,
  selectMes,
  mesesPlanillas,
  semanasPlanilla,
}) => {
  const yearName = yearPlanillas?.find(
    (y) => y.id === Number(selectYear),
  )?.year;
  const mesName = mesesPlanillas?.find((y) => y.id === Number(selectMes))?.mes;

  return (
    <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm mt-4">
      <table className="w-full  border-collapse text-center">
        <thead className="sticky top-0 bg-slate-900 border-b border-slate-200 z-10 shadow-sm">
          <tr>
            <th className="max-w-50 border-r border-slate-200 p-3 font-semibold uppercase text-[11px] tracking-wider text-slate-100">
              PERIODO DE PLANILLA
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[11px] tracking-wider text-slate-100">
              ESTADO ACTUAL
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[11px] tracking-wider text-slate-100">
              ACCIONES DISPONIBLES
            </th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {(!semanasPlanilla || semanasPlanilla.length === 0) && (
            <tr>
              <td
                colSpan={3}
                className="text-center p-8 text-slate-500 bg-slate-50/50"
              >
                No hay semanas registrados.
              </td>
            </tr>
          )}

          {semanasPlanilla.length > 0 &&
            semanasPlanilla.map((semana) => (
              <tr key={semana.id} className="border-b-1">
                <td className="border-r text-[11px] border-slate-200 bg-white p-2 font-semibold text-slate-800 uppercase">
                  {mesName} {yearName} (SEMANA {semana.numero_semana})
                </td>
                <td className="border-r text-[11px] border-slate-200 bg-white p-2 font-semibold text-slate-800 uppercase">
                  {semana.estado_planilla}
                </td>{" "}
                <td className="border-r text-[11px] border-slate-200 bg-white p-2 font-semibold text-slate-800 uppercase">
                  <div className="w-full flex items-center justify-center gap-2">
                    <Link to={`/rrhh/resumen-planilla/${semana.id}`}>
                      <Button
                        className="bg-slate-900 text-slate-50 text-[10px] font-semibold"
                        size="sm"
                      >
                        ENTRAR
                      </Button>
                    </Link>
                    <Button
                      className="bg-amber-500 text-slate-900 text-[10px] font-semibold"
                      size="sm"
                    >
                      PDF
                    </Button>{" "}
                    <Button
                      className="bg-sky-500 text-slate-50 text-[10px] font-semibold"
                      size="sm"
                    >
                      PDF
                    </Button>{" "}
                    <Button
                      className="bg-red-500 text-slate-50 text-[10px] font-semibold"
                      size="sm"
                    >
                      PDF
                    </Button>{" "}
                    <Button
                      className="bg-cyan-500 text-slate-50 text-[10px] font-semibold"
                      size="sm"
                    >
                      PDF
                    </Button>
                    <Button
                      className="bg-green-500 text-slate-900 text-[10px] font-semibold"
                      size="sm"
                    >
                      EXEL
                    </Button>
                    <Button
                      className="bg-amber-500 text-slate-900 text-[10px] font-semibold"
                      size="sm"
                    >
                      REAPERTURA
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaPlantilla;
