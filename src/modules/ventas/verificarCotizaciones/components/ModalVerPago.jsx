import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Divider,
  Chip,
} from "@nextui-org/react";
import { FiCheckCircle, FiAlertCircle, FiCreditCard } from "react-icons/fi";
import { formatNumber } from "../../../../assets/formats";
import formatDate from "../../../../hooks/FormatDate";

const ModalVerPago = ({ isOpen, onOpenChange, selectPago }) => {
  if (!selectPago) return null;

  const isVerified = selectPago.datos_verificacion !== null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
      classNames={{
        base: "border-[#e4e4e7] border-1",
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
                  Detalles del Pago
                </p>
                <p className="text-xs text-slate-500 font-normal">
                  ID Registro: #{selectPago.id}
                </p>
              </div>
              <Chip
                startContent={
                  isVerified ? (
                    <FiCheckCircle size={14} />
                  ) : (
                    <FiAlertCircle size={14} />
                  )
                }
                color={isVerified ? "success" : "warning"}
                variant="flat"
                size="sm"
              >
                {isVerified ? "Verificado" : "Pendiente"}
              </Chip>
            </ModalHeader>

            <ModalBody className="py-6 flex flex-col gap-6">
              {/* SECCIÓN 1: DATOS REGISTRADOS */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                  <FiCreditCard /> Información Registrada
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Banco / Método
                    </p>
                    <p className="text-sm font-semibold">
                      {selectPago.banco?.banco || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Monto Recibido
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

              {/* SECCIÓN 2: DATOS DE VERIFICACIÓN (SOLO SI EXISTE) */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                  <FiCheckCircle /> Verificación de Extracto
                </h4>
                {isVerified ? (
                  <div className="bg-green-50/50 p-3 rounded-lg border border-green-100 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="w-2/3">
                        <p className="text-[10px] text-green-700 uppercase">
                          Descripción Bancaria
                        </p>
                        <p className="text-[11px] leading-tight font-medium text-green-900">
                          {selectPago.datos_verificacion?.descripcion}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-green-700 uppercase">
                          Banco Verificado
                        </p>
                        <p className="text-xs font-bold text-green-900">
                          {selectPago.datos_verificacion?.banco}
                        </p>
                      </div>
                    </div>
                    <Divider className="bg-green-100" />
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[10px] text-green-700 uppercase">
                          Fecha Op.
                        </p>
                        <p className="text-xs font-semibold text-green-900">
                          {selectPago.datos_verificacion?.fecha_operacion}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-green-700 uppercase">
                          Abono Real
                        </p>
                        <p className="text-xs font-bold text-green-900">
                          S/.{" "}
                          {formatNumber(
                            Math.abs(
                              selectPago.datos_verificacion?.cargo_abono,
                            ),
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-green-700 uppercase">
                          N° Op. Banco
                        </p>
                        <p className="text-xs font-mono font-bold text-green-900">
                          {selectPago.datos_verificacion?.num_op}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-amber-50 border border-dashed border-amber-200 rounded-lg">
                    <FiAlertCircle className="text-amber-500 mb-2" size={24} />
                    <p className="text-xs text-amber-700 font-medium">
                      Este pago aún no ha sido conciliado.
                    </p>
                    <p className="text-[10px] text-amber-600">
                      No se encontró coincidencia en el extracto bancario.
                    </p>
                  </div>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose} size="sm">
                Cerrar Ventana
              </Button>
              {!isVerified && (
                <Button color="primary" size="sm" shadow>
                  Intentar Conciliar
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalVerPago;
