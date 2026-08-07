import React from "react";
import { Button } from "@nextui-org/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { formatDateES } from "../../../../utils/formatDateTime";

const CalendarioTabla = ({
  dataMeses = [],
  onOpenModal,
  onDeleteAction,
  selectYear,
  yearPlanillas,
}) => {
  return (
    <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm mt-4">
      <table className="w-full text-sm border-collapse text-center">
        <thead className="sticky top-0 bg-slate-900 border-b border-slate-200 z-10 shadow-sm">
          <tr>
            <th className="max-w-50 border-r border-slate-200 p-3 font-semibold uppercase text-xs tracking-wider text-slate-100">
              Mes
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-xs tracking-wider text-slate-100">
              Semanas
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-xs tracking-wider text-slate-100">
              Semana (Día)
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-xs tracking-wider text-slate-100">
              Día Exacto
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-xs tracking-wider text-slate-100">
              Feriado
            </th>
            <th className="p-3 font-semibold uppercase text-xs tracking-wider text-slate-100">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {(!dataMeses || dataMeses.length === 0) && (
            <tr>
              <td
                colSpan={6}
                className="text-center p-8 text-slate-500 bg-slate-50/50"
              >
                No hay meses registrados.
              </td>
            </tr>
          )}

          {dataMeses?.map((mes) => {
            const semanasBackend = mes.semanas_planilla || [];
            const isEmptyMes = semanasBackend.length === 0;
            const contextMes = {
              year_plantilla_id: mes.year_planilla_id,
              mes_plantilla_id: mes.id,
            };
            const nombreDelMes = `${mes.mes} - ${yearPlanillas.find((y) => y.id === Number(selectYear))?.year}`;

            if (isEmptyMes) {
              return (
                <tr
                  key={`empty-mes-${mes.id}`}
                  className="border-b border-slate-200"
                >
                  <td className="border-r border-slate-200 bg-slate-50 p-2 font-medium text-slate-800">
                    <div className="flex flex-col items-center gap-2">
                      <span>{nombreDelMes}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          isIconOnly
                          variant="flat"
                          color="success"
                          className="h-7 w-7"
                          onPress={() =>
                            onOpenModal("agregar_semana", contextMes)
                          }
                        >
                          <FiPlus />
                        </Button>
                        <Button
                          size="sm"
                          isIconOnly
                          variant="light"
                          color="danger"
                          className="h-7 w-7"
                          onPress={() => onDeleteAction("mes", mes.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td colSpan={5} className="text-slate-400 italic bg-white">
                    Sin semanas registradas.
                  </td>
                </tr>
              );
            }

            const totalDiasMes = semanasBackend.reduce(
              (acc, sem) => acc + (sem.dias_planillas?.length || 1),
              0,
            );

            return semanasBackend.map((semana, indexSemana) => {
              const diasBackend = semana.dias_planillas || [];
              const isEmptySemana = diasBackend.length === 0; // <-- NUEVA VARIABLE
              const contextSemana = {
                ...contextMes,
                semana_plantilla_id: semana.id,
              };

              // --- NUEVA VALIDACIÓN: SI LA SEMANA NO TIENE DÍAS ---
              if (isEmptySemana) {
                const esPrimerFilaMesVacia = indexSemana === 0;
                return (
                  <tr
                    key={`empty-sem-${semana.id}`}
                    className="border-b border-slate-200 bg-white"
                  >
                    {esPrimerFilaMesVacia && (
                      <td
                        rowSpan={totalDiasMes}
                        className="border-r border-slate-200 bg-slate-50 p-2 font-medium align-middle"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span>{nombreDelMes}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              isIconOnly
                              variant="flat"
                              color="success"
                              className="h-7 w-7"
                              onPress={() =>
                                onOpenModal("agregar_semana", contextMes)
                              }
                            >
                              <FiPlus />
                            </Button>
                            <Button
                              size="sm"
                              isIconOnly
                              variant="light"
                              color="danger"
                              className="h-7 w-7"
                              onPress={() => onDeleteAction("mes", mes.id)}
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="border-r border-slate-200 p-2 align-middle font-medium">
                      <div className="flex flex-col items-center gap-2 text-xs">
                        <span>SEMANA {semana.numero_semana}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            isIconOnly
                            variant="flat"
                            color="success"
                            className="h-7 w-7"
                            onPress={() =>
                              onOpenModal("agregar_dia", contextSemana)
                            }
                          >
                            <FiPlus />
                          </Button>
                          <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            color="danger"
                            className="h-7 w-7"
                            onPress={() => onDeleteAction("semana", semana.id)}
                          >
                            <FiTrash2 />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td colSpan={4} className="p-2 text-slate-400 italic">
                      Sin días registrados.
                    </td>
                  </tr>
                );
              }

              // --- SI LA SEMANA SÍ TIENE DÍAS, MAPEA NORMALMENTE ---
              return diasBackend.map((dia, indexDia) => {
                const esPrimerFilaMes = indexSemana === 0 && indexDia === 0;
                const esPrimerFilaSemana = indexDia === 0;
                const isFeriado = dia.bonificacion_feriado;

                return (
                  <tr
                    key={dia.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    {esPrimerFilaMes && (
                      <td
                        rowSpan={totalDiasMes}
                        className="border-r border-slate-200 bg-slate-50 p-2 font-medium align-middle"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span>{nombreDelMes}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              isIconOnly
                              variant="flat"
                              color="success"
                              className="h-7 w-7"
                              onPress={() =>
                                onOpenModal("agregar_semana", contextMes)
                              }
                            >
                              <FiPlus />
                            </Button>
                            <Button
                              size="sm"
                              isIconOnly
                              variant="light"
                              color="danger"
                              className="h-7 w-7"
                              onPress={() => onDeleteAction("mes", mes.id)}
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </div>
                      </td>
                    )}

                    {esPrimerFilaSemana && (
                      <td
                        rowSpan={diasBackend.length}
                        className="border-r border-slate-200 p-2 align-middle font-medium text-xs"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span>SEMANA {semana.numero_semana}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              isIconOnly
                              variant="flat"
                              color="success"
                              className="h-7 w-7"
                              onPress={() =>
                                onOpenModal("agregar_dia", contextSemana)
                              }
                            >
                              <FiPlus />
                            </Button>
                            <Button
                              size="sm"
                              isIconOnly
                              variant="light"
                              color="danger"
                              className="h-7 w-7"
                              onPress={() =>
                                onDeleteAction("semana", semana.id)
                              }
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </div>
                      </td>
                    )}

                    <td className="border-r border-slate-100 p-2 text-slate-600 text-xs">
                      SEMANA {semana.numero_semana}
                    </td>
                    <td className="border-r border-slate-100 p-2 text-slate-800 text-xs">
                      {formatDateES(dia.dia_plantilla)}
                    </td>
                    <td className="border-r border-slate-100 p-2">
                      {isFeriado ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">
                          SI
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">
                          NO
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => onDeleteAction("dia", dia.id)}
                      >
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                );
              });
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarioTabla;
