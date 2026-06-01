import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@nextui-org/react";
import { FiFileText, FiMail, FiAlertCircle } from "react-icons/fi";
import formatDate from "../../../../hooks/FormatDate";
import { API, API_DOC } from "../../../../utils/api";
import config from "../../../../utils/getToken"; // Asumiendo que usas tu config de token habitual

const ModalHistorialVacaciones = ({
  isOpen,
  onOpenChange,
  selectColaborador,
}) => {
  // === ESTADOS PARA EL MODAL DE CONFIRMACIÓN ===
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [vacacionToSend, setVacacionToSend] = useState(null);
  const [isSending, setIsSending] = useState(false);

  if (!selectColaborador) return null;

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "ACEPTADO":
        return "success";
      case "PENDIENTE":
        return "warning";
      case "RECHAZADO":
        return "danger";
      default:
        return "default";
    }
  };

  // === FUNCIONES PARA EL MANEJO DEL ENVÍO ===
  const handleOpenConfirm = (vacacion) => {
    setVacacionToSend(vacacion);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setVacacionToSend(null);
  };

  const handleConfirmSend = async () => {
    setIsSending(true);
    try {
      // Ajusta esta ruta a tu endpoint real de backend para enviar el correo
      const url = `${API}/rrhh/vacaciones/notificar-gerencia/${vacacionToSend.id}`;

      await axios.post(url, {}, config);

      toast.success("Solicitud de aprobación enviada a gerencia con éxito.");
      handleCloseConfirm();
      // Si tienes una función para recargar los datos (ej. handleFindColaboradores), llámala aquí.
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al enviar la solicitud.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* ========================================================
          MODAL PRINCIPAL: HISTORIAL DE VACACIONES
      ======================================================== */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="4xl"
        classNames={{
          base: "border-[#e4e4e7] border-1",
          header: "border-b-[1px] border-[#e4e4e7]",
          footer: "border-t-[1px] border-[#e4e4e7]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-slate-800">
                  Historial de Vacaciones
                </h2>
                <p className="text-sm font-normal text-slate-500">
                  Colaborador:{" "}
                  <span className="font-bold text-slate-700">
                    {selectColaborador.nombre_colaborador}
                  </span>
                </p>
              </ModalHeader>

              <ModalBody className="py-6 overflow-x-auto">
                <div className="min-w-[800px] border border-[#0070c0] rounded-t-md overflow-hidden">
                  <table className="w-full text-center border-collapse">
                    <thead className="bg-[#0070c0] text-white text-[10px] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-2 border-r border-[#005a9e]">
                          #
                        </th>
                        <th className="py-3 px-2 border-r border-[#005a9e]">
                          Tipo
                          <br />
                          Vacaciones
                        </th>
                        <th className="py-3 px-2 border-r border-[#005a9e]">
                          Fecha Inicio
                          <br />
                          Vacaciones
                        </th>
                        <th className="py-3 px-2 border-r border-[#005a9e]">
                          Fecha Final
                          <br />
                          Vacaciones
                        </th>
                        <th className="py-3 px-2 border-r border-[#005a9e]">
                          Días
                        </th>
                        <th className="py-3 px-2 border-r border-[#005a9e]">
                          Archivo
                          <br />
                          Subido
                        </th>
                        <th className="py-3 px-2 border-r border-[#005a9e]">
                          Acción
                        </th>
                        <th className="py-3 px-2">Estado</th>
                      </tr>
                    </thead>

                    <tbody className="bg-white">
                      {selectColaborador.vacaciones?.length > 0 ? (
                        selectColaborador.vacaciones.map((vac, index) => {
                          return (
                            <tr
                              key={vac.id}
                              className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              <td className="py-3 px-2 text-xs font-bold text-slate-500">
                                {index + 1}
                              </td>

                              <td className="py-3 px-2 text-xs font-bold text-slate-600">
                                {vac.tipo_vaciones || "SOLICITUD"}
                              </td>

                              <td className="py-3 px-2 text-xs font-semibold text-slate-700">
                                {formatDate(vac.fecha_inicio)}
                              </td>

                              <td className="py-3 px-2 text-xs font-semibold text-slate-700">
                                {formatDate(vac.fecha_final)}
                              </td>

                              <td className="py-3 px-2 text-xs font-bold text-slate-600">
                                {vac.dias_totales} días
                              </td>

                              <td className="py-3 px-2 text-center flex justify-center items-center">
                                {vac.solicitud_adjunto ? (
                                  <a
                                    href={
                                      vac.solicitud_adjunto.startsWith("http")
                                        ? vac.solicitud_adjunto
                                        : `${API_DOC}/solped/${vac.solicitud_adjunto}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-800 transition-colors"
                                    title="Ver Documento"
                                  >
                                    <FiFileText size={18} />
                                  </a>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>

                              <td className="py-3 px-2">
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-b from-slate-800 to-black text-white font-bold text-[9px] h-7 px-4 shadow-md"
                                  onPress={() => handleOpenConfirm(vac)}
                                  // Opcional: Deshabilitar el botón si ya está aceptado/rechazado
                                  // isDisabled={vac.pendiente_autorizacion !== "PENDIENTE"}
                                >
                                  ENVIAR
                                </Button>
                              </td>

                              <td className="py-3 px-2">
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color={getEstadoColor(
                                    vac.pendiente_autorizacion,
                                  )}
                                  className="font-bold text-[10px]"
                                >
                                  {vac.pendiente_autorizacion || "PENDIENTE"}
                                </Chip>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="py-8 text-sm text-slate-400 font-medium"
                          >
                            No hay vacaciones registradas para este colaborador.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar Historial
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ========================================================
          MODAL SECUNDARIO: CONFIRMACIÓN DE ENVÍO
      ======================================================== */}
      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        backdrop="opaque"
        size="md"
        classNames={{
          base: "border-[#e4e4e7] border-1",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-2">
                <div className="flex items-center gap-2 text-slate-800">
                  <FiMail className="text-blue-600" size={20} />
                  <h2 className="text-lg font-bold">Enviar Solicitud</h2>
                </div>
              </ModalHeader>

              <ModalBody className="py-4">
                <p className="text-sm text-slate-600 mb-2">
                  ¿Estás seguro de enviar esta solicitud de vacaciones para su
                  revisión? Se enviará una notificación por correo a gerencía
                  para su aprobación.
                </p>

                {vacacionToSend && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-2 flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-xs text-slate-500 font-semibold uppercase">
                        Colaborador
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {selectColaborador.nombre_colaborador}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-xs text-slate-500 font-semibold uppercase">
                        Tipo
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {vacacionToSend.tipo_vaciones}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-xs text-slate-500 font-semibold uppercase">
                        Periodo Solicitado
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {formatDate(vacacionToSend.fecha_inicio)} al{" "}
                        {formatDate(vacacionToSend.fecha_final)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold uppercase">
                        Días Totales
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {vacacionToSend.dias_totales} días
                      </span>
                    </div>
                  </div>
                )}

                {!vacacionToSend?.solicitud_adjunto && (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded-md mt-2 text-xs font-medium border border-amber-200">
                    <FiAlertCircle size={14} />
                    <span>Esta solicitud no tiene un documento adjunto.</span>
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={handleCloseConfirm}
                  isDisabled={isSending}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={handleConfirmSend}
                  isLoading={isSending}
                  className="font-bold font-sm"
                >
                  Confirmar Envío
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalHistorialVacaciones;
