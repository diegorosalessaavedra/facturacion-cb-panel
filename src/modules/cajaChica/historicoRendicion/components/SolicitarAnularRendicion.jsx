import { useState } from "react";
import { API } from "../../../../utils/api";
import axios from "axios";
import { toast } from "sonner";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import { inputClassNames } from "../../../../assets/classNames";
import {
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
} from "@nextui-org/react";
import config from "../../../../utils/getToken";

const SolicitarAnularRendicion = ({ isOpen, onOpenChange, id, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [comentario, setComentario] = useState("");

  const handleRemoveApertura = async (onClose) => {
    if (!comentario.trim()) {
      toast.error("El comentario es obligatorio para anular.");
      return;
    }

    setLoading(true);

    const url = `${API}/caja-chica/rendicion/${id}`;

    await axios
      .delete(url, {
        ...config,
        data: { comentario }, // Asegúrate de que tu backend espera el comentario aquí
      })
      .then(() => {
        toast.success(
          "La solicitud de anulación de la  rendicion fue enviada correctamente.",
        );
        onClose(); // Cierra el modal en éxito
        if (onSuccess) onSuccess(); // Refresca la tabla
      })
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            {/* {loading && <LoadingSpinner />} */}
            <ModalHeader className="flex flex-col gap-1 text-base">
              Solicitar anulación de rendicion
            </ModalHeader>
            <ModalBody>
              <div className="w-full flex flex-col gap-4 py-2">
                <Textarea
                  label="Motivo de anulación"
                  labelPlacement="outside" // Corregido
                  placeholder="Explique el motivo por el cual desea anular esta rendicion..."
                  variant="bordered"
                  color="danger"
                  classNames={inputClassNames}
                  isRequired
                  size="sm"
                  minRows={3}
                  value={comentario}
                  onValueChange={setComentario} // Capturando el valor
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                type="button"
                onPress={onClose}
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button
                className="bg-slate-900"
                color="primary"
                onPress={() => handleRemoveApertura(onClose)}
                isLoading={loading}
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

export default SolicitarAnularRendicion;
