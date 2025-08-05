import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { toast } from "sonner";

const ModalEliminarMetodoPago = ({
  isOpen,
  onOpenChange,
  handleFindPagos,
  selectPago,
}) => {
  const handleDelete = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/metodos-pago/${
      selectPago?.id
    }`;
    axios
      .delete(url, data, config)
      .then(() => {
        toast.success("El metodo de pago se elimino correctamente");
        handleFindPagos();
        onOpenChange(false);
      })
      .catch((err) =>
        toast.error("Hubo un error al eliminar el metodo de pago")
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
          Eliminar Metodo de pago
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <p>
              ¿Está seguro que quiere eliminar el metodo de pago{" "}
              {selectPago?.descripcion}?
            </p>
            <div className="w-full flex items-center justify-end gap-3 p-4">
              <Button
                color="danger"
                type="button"
                onPress={onOpenChange}
                onClick={() => {
                  setNumero("");
                  setDataDni({ nombre_completo: null });
                  setDataRuc({ nombre_o_razon_social: null });
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

export default ModalEliminarMetodoPago;
