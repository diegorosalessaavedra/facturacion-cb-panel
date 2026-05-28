import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@nextui-org/react";
import { FiFileText } from "react-icons/fi";
import formatDate from "../../../../hooks/FormatDate";
import { API_DOC } from "../../../../utils/api";

const ModalHistorialVacaciones = ({
  isOpen,
  onOpenChange,
  selectColaborador,
}) => {
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

  return (
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
                      <th className="py-3 px-2 border-r border-[#005a9e]">#</th>
                      <th className="py-3 px-2 border-r border-[#005a9e]">
                        Tipo
                        <br />
                        Constancia
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

                            {/* FECHAS SIN CONDICIONALES, SIEMPRE SE MUESTRAN NORMALES */}
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
  );
};

export default ModalHistorialVacaciones;
