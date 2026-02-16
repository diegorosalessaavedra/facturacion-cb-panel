import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { API } from "../../../../../utils/api";
import { useState } from "react";
import { handleAxiosError } from "../../../../../utils/handleAxiosError";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import config from "../../../../../utils/getToken";

const DeleteCategoriaGasto = ({
  isOpen,
  onOpenChange,
  handleFindCategoria,
  selectCategoria,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(false);

    const url = `${API}/caja-chica/categoria-gasto/${selectCategoria.id}`;

    axios
      .delete(url, config)
      .then(() => {
        toast.success("La categoria de gasto  se elimino correctamente");
        handleFindCategoria();
        onOpenChange(false);
      })
      .catch((err) => {
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
      size="xl"
    >
      {loading && <LoadingSpinner />}

      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Eliminar Categoria de Gasto
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <p>
              ¿Está seguro que quiere eliminar la categoria de gasto{" "}
              {selectCategoria.categoria}
            </p>
            <div className="w-full flex items-center justify-end gap-3 p-4">
              <Button color="danger" type="button" onPress={onOpenChange}>
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
export default DeleteCategoriaGasto;
