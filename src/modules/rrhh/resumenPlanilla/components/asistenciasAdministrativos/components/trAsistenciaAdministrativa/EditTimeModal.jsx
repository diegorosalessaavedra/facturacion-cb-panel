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
    
    setTimeout(() => {
      setLoading(false);
      toast.success("Solicitud enviada para validación.");
      // Ahora enviamos también el motivo al componente padre
      onConfirm(nuevaEntrada, nuevaSalida, motivo);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Solicitar Edición de Marcación
            </ModalHeader>
            <ModalBody>
              <p className="text-xs text-slate-500 mb-2">
                Las horas de entrada y salida están bloqueadas. 
                Para modificarlas manualmente, se enviará una solicitud.
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
                label="Motivo del cambio"
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
                Enviar Solicitud
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditTimeModal;