import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import React from "react";
import config from "../../../../utils/getToken";
import { toast } from "sonner";

const ModalEliminarProveedor = ({
  isOpen,
  onOpenChange,
  findProveedores,
  selectProveedor,
}) => {
  const handleDelete = () => {
    const url = `${import.meta.env.VITE_URL_API}/proveedores/${
      selectProveedor?.id
    }`;
    axios
      .delete(url, config)
      .then(() => {
        toast.success("El proveedor se elimino correctamente");
        findProveedores();
        onOpenChange(false);
      })
      .catch((err) => toast.error("Hubo un error al eliminar al proveedor"));
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
          Eliminar Proveedor
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <p>
              ¿Está seguro que quiere eliminar al proveedor{" "}
              {selectProveedor?.tipoDocIdentidad === "RUC"
                ? selectProveedor?.nombreComercial
                : selectProveedor?.nombreApellidos}
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
export default ModalEliminarProveedor;
