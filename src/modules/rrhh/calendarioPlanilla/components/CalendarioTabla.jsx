import React from "react";
import { Button } from "@nextui-org/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const CalendarioTabla = ({ dataMeses = [], onOpenModal, onDeleteAction }) => {
  // Helper para convertir el número del mes que viene de la BD a texto
  const nombresMeses = [
    "", // Índice 0 vacío para que el mes 1 coincida con el índice 1
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm mt-4">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-amber-50 border-b border-slate-200 z-10 shadow-sm">
          <tr>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-xs tracking-wider w-[160px] text-amber-900 text-left">
              Mes
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-xs tracking-wider w-[220px] text-amber-900 text-left">
              Semanas
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-xs tracking-wider w-[180px] text-amber-900 text-center">
              Semana (Día)
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-xs tracking-wider text-amber-900 text-left">
              Día Exacto
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-xs tracking-wider w-[120px] text-amber-900 text-center">
              Feriado
            </th>
            <th className="p-3 font-semibold uppercase text-xs tracking-wider w-[100px] text-amber-900 text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {(!dataMeses || dataMeses.length === 0) && (
            <tr>
              <td
                colSpan={6}
                className="text-center p-8 text-slate-500 bg-slate-50/50"
              >
                No hay meses registrados. Haz clic en "Agregar Mes" para
                comenzar.
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
            const nombreDelMes = nombresMeses[mes.mes] || `Mes ${mes.mes}`;

            if (isEmptyMes) {
              return (
                <tr
                  key={`empty-mes-${mes.id}`}
                  className="border-b border-slate-200"
                >
                  <td className="border-r border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 align-top">
                    <div className="flex flex-col gap-2">
                      <span className="text-base">{nombreDelMes}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          isIconOnly
                          variant="flat"
                          color="success"
                          className="h-7 w-7 min-w-min"
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
                          className="h-7 w-7 min-w-min"
                          onPress={() => onDeleteAction("mes", mes.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td
                    colSpan={5}
                    className="p-3 text-slate-400 italic bg-white"
                  >
                    Sin semanas registradas.
                  </td>
                </tr>
              );
            }

            const totalDiasMes = semanasBackend.reduce(
              (acc, sem) =>
                acc +
                (sem.dias_planillas?.length > 0
                  ? sem.dias_planillas.length
                  : 1),
              0,
            );

            return semanasBackend.map((semana, indexSemana) => {
              const diasBackend = semana.dias_planillas || [];
              const isEmptySemana = diasBackend.length === 0;
              const contextSemana = {
                ...contextMes,
                semana_plantilla_id: semana.id,
              };
              const esPrimerFilaMes = indexSemana === 0;

              if (isEmptySemana) {
                return (
                  <tr
                    key={`empty-sem-${semana.id}`}
                    className="border-b border-slate-200"
                  >
                    {esPrimerFilaMes && (
                      <td
                        rowSpan={totalDiasMes}
                        className="border-r border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 align-top"
                      >
                        <div className="flex flex-col gap-2">
                          <span className="text-base">{nombreDelMes}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              isIconOnly
                              variant="flat"
                              color="success"
                              className="h-7 w-7 min-w-min"
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
                              className="h-7 w-7 min-w-min"
                              onPress={() => onDeleteAction("mes", mes.id)}
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="border-r border-slate-200 bg-white p-3 font-medium text-slate-700 align-top">
                      <div className="flex flex-col gap-2">
                        <span>Semana {semana.numero_semana}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            isIconOnly
                            variant="flat"
                            color="success"
                            className="h-7 w-7 min-w-min"
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
                            className="h-7 w-7 min-w-min"
                            onPress={() => onDeleteAction("semana", semana.id)}
                          >
                            <FiTrash2 />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td
                      colSpan={4}
                      className="p-3 text-slate-400 italic bg-white"
                    >
                      Sin días registrados.
                    </td>
                  </tr>
                );
              }

              const totalDiasSemana = diasBackend.length;

              return diasBackend.map((dia, indexDia) => {
                const esPrimerDiaMes = indexSemana === 0 && indexDia === 0;
                const esPrimerDiaSemana = indexDia === 0;
                const isFeriado = dia.esFeriado || false;

                return (
                  <tr
                    key={dia.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-white"
                  >
                    {esPrimerDiaMes && (
                      <td
                        rowSpan={totalDiasMes}
                        className="border-r border-slate-200 bg-slate-50 p-3 font-medium text-slate-800 align-top"
                      >
                        <div className="flex flex-col gap-2">
                          <span className="text-base">{nombreDelMes}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              isIconOnly
                              variant="flat"
                              color="success"
                              className="h-7 w-7 min-w-min"
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
                              className="h-7 w-7 min-w-min"
                              onPress={() => onDeleteAction("mes", mes.id)}
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </div>
                      </td>
                    )}

                    {esPrimerDiaSemana && (
                      <td
                        rowSpan={totalDiasSemana}
                        className="border-r border-slate-200 p-3 font-medium text-slate-700 align-top"
                      >
                        <div className="flex flex-col gap-2">
                          <span>Semana {semana.numero_semana}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              isIconOnly
                              variant="flat"
                              color="success"
                              className="h-7 w-7 min-w-min"
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
                              className="h-7 w-7 min-w-min"
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

                    <td className="border-r border-slate-100 text-center p-3 text-slate-600">
                      Semana {semana.numero_semana}
                    </td>
                    <td className="border-r border-slate-100 p-3 text-slate-800">
                      {dia.dia_plantilla}
                    </td>
                    <td className="border-r border-slate-100 text-center p-3">
                      {dia.bonificacion_feriado ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">
                          SI
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">
                          NO
                        </span>
                      )}
                    </td>
                    <td className="text-center p-2">
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
