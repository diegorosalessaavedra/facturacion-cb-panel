import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../utils/getToken";

const ModalEliminarEncargado = ({
  isOpen,
  onOpenChange,
  handleFindEncargados,
  selectedEncargado,
}) => {
  const handleDelete = () => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/encargado/${
      selectedEncargado?.id
    }`;
    axios
      .delete(url, config)
      .then(() => {
        toast.success("El encargado se elimino correctamente");
        handleFindEncargados();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error("Hubo un error al eliminar el encargado");
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Eliminar Metodo de pago
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <p>
              ¿Está seguro que quiere eliminar al encargado{" "}
              {selectedEncargado?.nombre}?
            </p>
            <div className="w-full flex items-center justify-end gap-3 p-4">
              <Button
                color="danger"
                type="button"
                onPress={onOpenChange}
                onClick={() => {
                  reset();
                }}
              >
                Cancelar
              </Button>
              <Button color="primary" onClick={() => handleDelete()}>
                Eliminar
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalEliminarEncargado;
