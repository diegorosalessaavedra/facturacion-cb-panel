import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip,
} from "@nextui-org/react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiCreditCard,
  FiXCircle,
  FiFileText,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import { formatNumber } from "../../../../assets/formats";
import { API_DOC } from "../../../../utils/api";
import formatDate from "../../../../hooks/FormatDate";
import { formatDateTime } from "../../../../utils/formatDateTime";

const ModalVerHistorialValidacionPago = ({
  isOpen,
  onOpenChange,
  selectPago,
}) => {
  if (!selectPago) return null;

  const estadoActual = selectPago.estado_verificacion;
  const historial = selectPago.datos_validacion?.historial_validacion || [];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Conforme":
        return "success";
      case "Observado":
        return "warning";
      case "Rechazado":
        return "danger";
      default:
        return "default";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "Conforme":
        return <FiCheckCircle size={14} />;
      case "Rechazado":
        return <FiXCircle size={14} />;
      default:
        return <FiAlertCircle size={14} />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "h-[90vh] border-[#e4e4e7] border-1",
        header: "border-b-[1px] border-[#e4e4e7]",
        footer: "border-t-[1px] border-[#e4e4e7]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center pr-10">
              <div className="flex flex-col">
                <p className="text-md font-bold text-slate-800">
                  Historial de Validación
                </p>
                <p className="text-xs text-slate-500 font-normal">
                  ID Registro: #{selectPago.id}
                </p>
              </div>
              <Chip
                startContent={getEstadoIcon(estadoActual)}
                color={getEstadoColor(estadoActual)}
                variant="flat"
                size="sm"
                className="capitalize"
              >
                {estadoActual || "Pendiente"}
              </Chip>
            </ModalHeader>

            <ModalBody className="py-6 flex flex-col gap-6 overflow-y-auto">
              {/* SECCIÓN 1: DATOS REGISTRADOS */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                  <FiCreditCard /> Información Registrada (Cotización)
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Banco
                    </p>
                    <p className="text-sm font-semibold">
                      {selectPago.banco?.banco || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Monto
                    </p>
                    <p className="text-sm font-bold text-blue-700">
                      S/. {formatNumber(selectPago.monto)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      N° Operación
                    </p>
                    <p className="text-sm font-mono font-bold">
                      {selectPago.operacion || "S/N"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Fecha Reportada
                    </p>
                    <p className="text-sm font-semibold">
                      {formatDate(selectPago.fecha)}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: TIMELINE */}
              <div className="flex flex-col gap-4 p-2 mt-2 border-t border-slate-200 pt-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <FiClock /> Timeline de Validaciones
                </h3>

                {historial.length > 0 ? (
                  <div className="flex flex-col gap-4 relative">
                    {/* Línea vertical de la estética timeline */}
                    <div className="absolute left-3 top-2 bottom-2 w-[2px] bg-slate-200 z-0"></div>

                    {historial.map((item, index) => {
                      const esReiniciado =
                        item.estado === "Reiniciado" ||
                        item.estado === "Observado";

                      return (
                        <div
                          key={item.id || index}
                          className="relative z-10 pl-8"
                        >
                          {/* El puntito se mantiene igual para todos (solo cambia el color) */}
                          <div
                            className={`absolute left-[9px] top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                              esReiniciado
                                ? "bg-warning"
                                : item.estado === "Rechazado"
                                  ? "bg-danger"
                                  : "bg-success"
                            }`}
                          ></div>

                          {/* Tarjeta con estética uniforme */}
                          <div
                            className={`bg-white border rounded-lg p-3 shadow-sm flex flex-col gap-2 ${
                              esReiniciado
                                ? "border-warning-200 bg-warning-50/30"
                                : item.estado === "Rechazado"
                                  ? "border-danger-100"
                                  : "border-success-100"
                            }`}
                          >
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                                  Validación #{historial.length - index}
                                </span>
                                <Chip
                                  startContent={
                                    esReiniciado ? (
                                      <FiRefreshCw
                                        size={12}
                                        className="animate-spin"
                                      />
                                    ) : item.estado === "Rechazado" ? (
                                      <FiXCircle size={12} />
                                    ) : (
                                      <FiCheckCircle size={12} />
                                    )
                                  }
                                  color={
                                    esReiniciado
                                      ? "warning"
                                      : item.estado === "Rechazado"
                                        ? "danger"
                                        : "success"
                                  }
                                  variant="flat"
                                  className="h-5 px-1 text-[10px] font-bold"
                                >
                                  {item.estado || "Validado"}
                                </Chip>
                              </div>
                              <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                {formatDateTime(item.createdAt)}
                              </span>
                            </div>

                            {/* Contenido condicional dentro de la tarjeta estandarizada */}
                            {esReiniciado ? (
                              <div className="py-2 flex flex-col gap-2">
                                <p className="text-xs text-warning-800 font-medium">
                                  El proceso de validación fue reiniciado
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  <div>
                                    <p className="text-[10px] text-slate-400 uppercase">
                                      Banco Validado
                                    </p>
                                    <p className="text-xs font-semibold">
                                      {item.banco || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-slate-400 uppercase">
                                      Cargo / Abono
                                    </p>
                                    <p className="text-xs font-bold text-blue-600">
                                      S/. {formatNumber(item.cargo_abono)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-slate-400 uppercase">
                                      N° Op Validado
                                    </p>
                                    <p className="text-xs font-mono">
                                      {item.num_op || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-slate-400 uppercase">
                                      Fecha Op.
                                    </p>
                                    <p className="text-xs">
                                      {formatDate(item.fecha_operacion)}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                                  <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">
                                    Observación:
                                  </span>
                                  <p className="text-xs text-slate-700 italic">
                                    "
                                    {item.observacion_validacion ||
                                      "Sin observaciones registradas"}
                                    "
                                  </p>
                                </div>

                                {item.link_vaucher && (
                                  <div className="mt-1 flex justify-end">
                                    <Button
                                      as="a"
                                      href={`${API_DOC}${item.link_vaucher}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      size="sm"
                                      color="primary"
                                      variant="flat"
                                      startContent={<FiFileText />}
                                      className="h-7 text-[10px]"
                                    >
                                      Ver Voucher
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-sm text-slate-500">
                      No hay registros de validación.
                    </p>
                  </div>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="primary"
                onPress={onClose}
                size="sm"
                variant="flat"
              >
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalVerHistorialValidacionPago;
