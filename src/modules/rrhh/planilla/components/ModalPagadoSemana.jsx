import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import { toast } from "sonner";
import axios from "axios";

import { handleAxiosError } from "../../../../utils/handleAxiosError";
import { API } from "../../../../utils/api";
import config from "../../../../utils/getToken";

const ModalPagadoSemana = ({ selectSemana, isOpen, onOpenChange, fetchSemanas }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmar = () => {
    if (!selectSemana?.id) return;

    setLoading(true);
    
    // Ajusta la ruta base según tu backend (ej. /semanas-planilla/pagado/:id)
    const url = `${API}/semanas-planilla/pagado/${selectSemana.id}`;
    const toastId = toast.loading("Actualizando estado...");

    axios
      .patch(url, {}, config)
      .then(() => {
        toast.success("Estado cambiado a PAGADO exitosamente", { id: toastId });
        if (fetchSemanas) fetchSemanas(); // Recarga la tabla de semanas
        onOpenChange(false); // Cierra el modal
      })
      .catch((err) => {
        toast.error("Error al actualizar el estado", { id: toastId });
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
      classNames={{
        base: "rounded-[24px] bg-slate-50",
        header: "p-6 pb-2 text-slate-900 font-bold",
        body: "p-6 pt-2",
        footer: "p-6 pt-2",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Confirmar Pago</ModalHeader>
            <ModalBody>
              <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm text-center">
                <p className="text-sm text-slate-700 font-medium mb-3">
                  ¿Estás seguro que deseas cambiar el estado de la semana{" "}
                  <span className="font-bold text-slate-900">
                    {selectSemana?.numero_semana}
                  </span>{" "}
                  a <span className="font-bold text-emerald-600">PAGADO</span>?
                </p>
                <p className="text-xs text-slate-500">
                  Esta acción actualizará el estado de la planilla en el sistema y no requiere adjuntar archivos en este paso.
                </p>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between gap-3 mt-2">
              <Button
                variant="flat"
                onPress={onClose}
                className="w-full text-slate-700 bg-slate-200 hover:bg-slate-300 font-bold"
              >
                Cancelar
              </Button>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                onPress={handleConfirmar}
                isLoading={loading}
              >
                Sí, Confirmar Pago
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalPagadoSemana;