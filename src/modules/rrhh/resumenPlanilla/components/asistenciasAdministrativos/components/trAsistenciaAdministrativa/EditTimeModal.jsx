import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { toast } from "sonner";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import { handleAxiosError } from "../../../../../../../utils/handleAxiosError"; 

const EditTimeModal = ({ isOpen, onOpenChange, datosAsistencia, onConfirm }) => {
  const [nuevaEntrada, setNuevaEntrada] = useState(datosAsistencia.hora_entrada || "");
  const [nuevaSalida, setNuevaSalida] = useState(datosAsistencia.hora_salida || "");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSolicitarCambio = () => {
    if (!motivo.trim()) {
      return toast.error("Debes ingresar un motivo para la validación");
    }

    setLoading(true);
    const toastId = toast.loading("Enviando solicitud...");

    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/cambio-hora/${datosAsistencia.id}`;

    axios
      .post(url, { nuevaEntrada, nuevaSalida, motivo }, config)
      .then((res) => {
        toast.success("Actualizado correctamente", { id: toastId });
        if (onConfirm) onConfirm(nuevaEntrada, nuevaSalida); 
        onOpenChange(false); 
      })
      .catch((err) => {
        toast.error("Error al enviar la solicitud", { id: toastId });
        console.error(err);
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Actualizar Marcación Manualmente
            </ModalHeader>
            <ModalBody>
              <p className="text-xs text-slate-500 mb-2">
                Actualiza las horas de entrada y salida e indica el motivo del cambio.
                Se enviará una notificación por correo.
              </p>
              
              <div className="flex gap-4">
                <Input
                  type="time"
                  label="Nueva Hora Entrada"
                  value={nuevaEntrada}
                  onChange={(e) => setNuevaEntrada(e.target.value)}
                  size="sm"
                />
                <Input
                  type="time"
                  label="Nueva Hora Salida"
                  value={nuevaSalida}
                  onChange={(e) => setNuevaSalida(e.target.value)}
                  size="sm"
                />
              </div>

              <Input
                type="text"
                label="Motivo de la actualización"
                placeholder="Ej: Olvidó marcar, permiso médico..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                size="sm"
                className="mt-2"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button 
                color="primary" 
                isLoading={loading} 
                onPress={handleSolicitarCambio}
              >
                Actualizar y Notificar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditTimeModal;