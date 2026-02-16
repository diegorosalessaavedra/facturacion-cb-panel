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

const DeleteConceptoRendicion = ({
  isOpen,
  onOpenChange,
  handleFindConcepto,
  selectConcepto,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(false);

    const url = `${API}/caja-chica/conceptos-rendicion/${selectConcepto.id}`;

    axios
      .delete(url, config)
      .then(() => {
        toast.success("El concepto de rendición se elimino correctamente");
        handleFindConcepto();
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
          Eliminar Concepto de Rendición
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <p>
              ¿Está seguro que quiere eliminar el concepto de rendición{" "}
              {selectConcepto.conceptos}
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
export default DeleteConceptoRendicion;
