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
import config from "../../../../../../utils/getToken";

const ModalEliminarCuentasBancarias = ({
  isOpen,
  onOpenChange,
  handleFindCuentasBancarias,
  selectCuentaBancaria,
}) => {
  const handleDelete = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/cuentas-banco/${
      selectCuentaBancaria?.id
    }`;
    axios
      .delete(url, data, config)
      .then(() => {
        toast.success("La cuenta bancaria se elimino correctamente");
        handleFindCuentasBancarias();
        onOpenChange(false);
      })
      .catch((err) =>
        toast.error("Hubo un error al eliminar la cuenta bancaria")
      );
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
          Eliminar Cuenta Bancaria
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <p>
              ¿Está seguro que quiere eliminar la cuenta bancaria{" "}
              {selectCuentaBancaria?.descripcion}?
            </p>
            <div className="w-full flex items-center justify-end gap-3 p-4">
              <Button color="danger" type="button" onPress={onOpenChange}>
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

export default ModalEliminarCuentasBancarias;
