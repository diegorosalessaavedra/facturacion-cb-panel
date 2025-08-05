import React, { useState } from "react";
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

const ModalEliminarCentroCostos = ({
  isOpen,
  onOpenChange,
  handleFindCentroCostos,
  selectedCentroCosto,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);

    const url = `${import.meta.env.VITE_URL_API}/ajustes/centro-costos/${
      selectedCentroCosto.id
    }`;
    axios
      .delete(url, config)
      .then(() => {
        toast.success("El encargado se elimino correctamente");
        handleFindCentroCostos();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error("Hubo un error al eliminar el encargado");
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
      size="xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Eliminar Centro de Costo
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <p>
              ¿Está seguro que quiere eliminar el centro de costo{" "}
              {selectedCentroCosto?.glosa_sub_centro_costo}?
            </p>
            <div className="w-full flex items-center justify-end gap-3 p-4">
              <Button
                color="danger"
                type="button"
                onPress={() => {
                  reset();
                  onOpenChange(false);
                }}
              >
                Cancelar
              </Button>
              <Button color="primary" onPress={() => handleDelete()}>
                Eliminar
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalEliminarCentroCostos;
