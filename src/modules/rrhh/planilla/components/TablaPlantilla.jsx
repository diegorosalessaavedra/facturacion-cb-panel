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

  const yearName = yearPlanillas?.find(
    (y) => y.id === Number(selectYear),
  )?.year;
  const mesName = mesesPlanillas?.find((y) => y.id === Number(selectMes))?.mes;

  const handleReaperturarSemana = (idSemana) => {
    if (!idSemana) return;

    setLoadingId(idSemana);
    const toastId = toast.loading("Reaperturando semana...");
    const url = `${API}/semanas-planilla/reaperturar/${idSemana}`;

    axios
      .patch(url, {}, config)
      .then((res) => {
        toast.success("Semana Reabierta correctamente", { id: toastId });
        if (fetchSemanas) fetchSemanas();
      })
      .catch((err) => {
        toast.error("Error al reaperturar", { id: toastId });
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

  // NUEVA FUNCIÓN PARA ABRIR EL MODAL DE CP
  const handleOpenModalCp = (semana) => {
    setSelectSemana(semana);
    onOpen();
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
              const isFinalizado = semana.estado_planilla === "FINALIZADO";

              return (
                <tr
                  key={semana.id}
                  className="border-b-1 hover:bg-slate-50 transition-colors"
                >
                  <td className="border-r text-[11px] border-slate-200 p-2 font-semibold text-slate-800 uppercase">
                    {mesName} {yearName} (SEMANA {semana.numero_semana})
                  </td>
                  <td
                    className={`border-r text-[11px] border-slate-200 p-2 font-bold uppercase tracking-wider ${
                      isFinalizado
                        ? "text-red-500 bg-red-50/50"
                        : "text-emerald-600 bg-emerald-50/50"
                    }`}
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

                      {/* BOTÓN PARA ABRIR MODAL CON LA SEMANA ACTUAL */}
                      <Button
                        className="bg-sky-500 text-slate-900 text-[10px] font-bold"
                        size="sm"
                        onPress={() => handleOpenModalCp(semana)}
                      >
                        ADJUNTAR CP
                      </Button>

                      {isFinalizado && (
                        <Button
                          color="danger"
                          variant="flat"
                          className="text-[10px] font-bold border border-danger-200"
                          size="sm"
                          onPress={() => handleReaperturarSemana(semana.id)}
                          isLoading={loadingId === semana.id}
                        >
                          REAPERTURAR
                        </Button>
                      )}
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
        selectSemana={selectSemana} // Se pasa el estado al modal
        fetchSemanas={fetchSemanas}
      />
    </div>
  );
};

export default TablaPlantilla;
