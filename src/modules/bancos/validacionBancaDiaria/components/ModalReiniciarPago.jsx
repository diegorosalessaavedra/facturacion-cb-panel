import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip,
} from "@nextui-org/react";
import { FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";
import config from "../../../../utils/getToken";
import { toast } from "sonner";
import { API } from "../../../../utils/api";
import { handleAxiosError } from "../../../../utils/handleAxiosError";

const ModalReiniciarPago = ({
  isOpen,
  onOpenChange,
  selectPago,
  handleFindCotizaciones,
}) => {
  const [loading, setLoading] = useState(false);

  // Evitar renderizados si no hay datos
  if (!selectPago) return null;

  const estadoActual = selectPago.estado_verificacion;

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

  // Función simplificada y limpia solo para el propósito de reiniciar
  const handleReiniciar = async () => {
    setLoading(true);
    const url = `${API}/ventas/pagos-cotizaciones/${selectPago.id}`;

    try {
      await axios.patch(url, { estado_verificacion: "Observado" }, config);
      toast.success("El pago ha sido reiniciado (Observado).");
      handleFindCotizaciones(); // Actualizamos la tabla principal
      onOpenChange(false); // Cerramos el modal
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
      classNames={{
        base: "border-slate-200 border-1 bg-white",
        header: "border-b-[1px] border-slate-200",
        footer: "border-t-[1px] border-slate-200 bg-slate-50",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center pr-10">
              <div className="flex flex-col gap-1">
                <p className="text-md font-bold text-slate-900">
                  Reiniciar Validación
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  ID Registro: #{selectPago.id}
                </p>
              </div>
              <Chip
                startContent={getEstadoIcon(estadoActual)}
                color={getEstadoColor(estadoActual)}
                variant="flat"
                size="sm"
                className="capitalize font-medium"
              >
                {estadoActual || "Pendiente"}
              </Chip>
            </ModalHeader>

            <ModalBody className="py-6">
              {/* Caja de alerta con alto contraste para la advertencia */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
                <div className="flex gap-3">
                  <FiAlertCircle className="text-amber-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-slate-900">
                      ¿Estás seguro de reiniciar este pago?
                    </p>
                    <p className="text-xs text-slate-600">
                      El estado actual pasará a ser{" "}
                      <span className="font-bold text-amber-700">
                        Observado
                      </span>{" "}
                      y se requerirá una nueva revisión administrativa.
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="flex justify-between w-full">
              <Button
                variant="flat"
                color="default"
                onPress={onClose}
                size="sm"
                isDisabled={loading}
                className="font-medium text-slate-700"
              >
                Cancelar
              </Button>
              <Button
                color="warning"
                variant="solid"
                onPress={handleReiniciar}
                size="sm"
                isLoading={loading}
                className="font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-sm"
              >
                Sí, reiniciar pago
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalReiniciarPago;
