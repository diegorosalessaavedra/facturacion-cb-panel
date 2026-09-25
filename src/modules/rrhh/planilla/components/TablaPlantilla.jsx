import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { API } from "../../../../utils/api";
import config from "../../../../utils/getToken";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import { generarPDFResumenPlanilla } from "../../../../utils/plantillasPdf/resumenSemanaPdf";
import { generarExcelResumenPlanilla } from "../../../../utils/plantillasExel/resumenSemanaExcel";
import ModalCpSemana from "./ModalCpSemana";

const TablaPlantilla = ({
  selectYear,
  yearPlanillas,
  selectMes,
  mesesPlanillas,
  semanasPlanilla,
  fetchSemanas,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectSemana, setSelectSemana] = useState(null);

  const [loadingId, setLoadingId] = useState(null);
  const [loadingPdfId, setLoadingPdfId] = useState(null);

  const yearName = yearPlanillas?.find((y) => y.id === Number(selectYear))?.year;
  const mesName = mesesPlanillas?.find((y) => y.id === Number(selectMes))?.mes;

  // Modificado: Ahora notifica al gerente en lugar de reaperturar directamente
  const handleNotificarReapertura = (idSemana) => {
    if (!idSemana) return;

    setLoadingId(idSemana);
    const toastId = toast.loading("Enviando solicitud de reapertura al Gerente...");

    // Asegúrate de que esta URL coincida con la ruta que creamos en el backend para NOTIFICAR
    const url = `${API}/semanas-planilla/notificar/${idSemana}`;

    axios
      .patch(url, {}, config) // Usando PATCH si tu backend lo requiere, o POST según lo hayas definido
      .then((res) => {
        toast.success("Solicitud enviada correctamente. El Gerente debe aprobarla.", { id: toastId, duration: 5000 });
        if (fetchSemanas) fetchSemanas();
      })
      .catch((err) => {
        toast.error("Error al enviar la solicitud", { id: toastId });
        handleAxiosError(err);
      })
      .finally(() => {
        setLoadingId(null);
      });
  };

  const handlePdfButton = (idSemana, semana) => {
    setLoadingPdfId(idSemana);
    const toastId = toast.loading("Generando PDF...");
    const url = `${API}/semanas-planilla/resumen/${idSemana}`;

    axios
      .get(url, config)
      .then((res) => {
        const dataSemanaParaPDF = {
          numero_semana: semana.numero_semana,
          mes_planilla: { mes: mesName },
          year_planilla: { year: yearName },
          totalSemanas: semanasPlanilla.length,
        };

        generarPDFResumenPlanilla(res.data.colaboradores, dataSemanaParaPDF);
        toast.success("PDF generado exitosamente", { id: toastId });
      })
      .catch((err) => {
        toast.error("Error al obtener datos para el PDF", { id: toastId });
        handleAxiosError(err);
      })
      .finally(() => {
        setLoadingPdfId(null);
      });
  };

  const handleExcelButton = (idSemana, semana) => {
    const toastId = toast.loading("Generando Excel...");
    const url = `${API}/semanas-planilla/resumen/${idSemana}`;

    axios
      .get(url, config)
      .then((res) => {
        const dataSemanaParaExportar = {
          numero_semana: semana.numero_semana,
          mes_planilla: { mes: mesName },
          year_planilla: { year: yearName },
          totalSemanas: semanasPlanilla.length,
        };

        generarExcelResumenPlanilla(
          res.data.colaboradores,
          dataSemanaParaExportar,
        );
        toast.success("Excel generado exitosamente", { id: toastId });
      })
      .catch((err) => {
        toast.error("Error al obtener datos para el Excel", { id: toastId });
        handleAxiosError(err);
      });
  };

  const handleOpenModalCp = (semana) => {
    setSelectSemana(semana);
    onOpen();
  };

  // Función Helper para obtener los estilos según el estado
  const getEstadoStyles = (estado) => {
    switch (estado) {
      case "EN PROCESO":
        return "text-red-600 bg-red-100"; // Rojo
      case "PROXIMO A PAGO":
        return "text-amber-600 bg-amber-100"; // Ámbar
      case "PAGADO":
      case "FINALIZADO":
        return "text-emerald-600 bg-emerald-100"; // Verde
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  return (
    <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm mt-4">
      <table className="w-full border-collapse text-center">
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
          {!semanasPlanilla || semanasPlanilla.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="text-center p-8 text-slate-500 bg-slate-50/50 font-medium"
              >
                No hay semanas registradas.
              </td>
            </tr>
          ) : (
            semanasPlanilla.map((semana) => {


              const estadoClases = getEstadoStyles(semana.estado_planilla);

              return (
                <tr
                  key={semana.id}
                  className="border-b-1 hover:bg-slate-50 transition-colors"
                >
                  <td className="border-r text-[11px] border-slate-200 p-2 font-semibold text-slate-800 uppercase">
                    {mesName} {yearName} (SEMANA {semana.numero_semana})
                  </td>

                  {/* Celda de Estado con colores dinámicos */}
                  <td
                    className={`border-r text-[11px] border-slate-200 p-2 font-bold uppercase tracking-wider ${estadoClases}`}
                  >
                    {semana.estado_planilla}
                  </td>

                  <td className="border-r text-[11px] border-slate-200 p-2">
                    <div className="w-full flex items-center justify-center gap-2">


                      <Link to={`/rrhh/resumen-planilla/${semana.id}`}>
                        <Button
                          className="bg-slate-900 text-slate-50 text-[10px] font-bold"
                          size="sm"
                        >
                          ENTRAR
                        </Button>
                      </Link>

                      <Button
                        className="bg-red-500 text-slate-900 text-[10px] font-bold"
                        size="sm"
                        isLoading={loadingPdfId === semana.id}
                        onPress={() => handlePdfButton(semana.id, semana)}
                      >
                        PDF
                      </Button>
                      <Button
                        className="bg-green-500 text-slate-900 text-[10px] font-bold"
                        size="sm"
                        onPress={() => handleExcelButton(semana.id, semana)}
                      >
                        EXCEL
                      </Button>


                      <Button
                        className="bg-sky-500 text-slate-900 text-[10px] font-bold"
                        size="sm"
                        onPress={() => handleOpenModalCp(semana)}
                      >
                        ADJUNTAR CP
                      </Button>

                      {semana.estado_planilla !== "EN PROCESO" &&
                        <Button
                          color="danger"
                          variant="flat"
                          className="text-[10px] font-bold border border-danger-200"
                          size="sm"
                          onPress={() => handleNotificarReapertura(semana.id)}
                          isLoading={loadingId === semana.id}
                        >
                          SOLICITAR REAPERTURA
                        </Button>
                      }


                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <ModalCpSemana
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectSemana={selectSemana}
        fetchSemanas={fetchSemanas}
      />
    </div>
  );
};

export default TablaPlantilla;