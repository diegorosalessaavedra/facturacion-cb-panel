import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../../utils/getToken";
import Loading from "../../../../../hooks/Loading";
import { useState } from "react";

const ModalDeleteAgencia = ({
  isOpen,
  onOpenChange,
  findAgencias,
  selectAgencia,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);

    const url = `${import.meta.env.VITE_URL_API}/agencias/${selectAgencia?.id}`;
    axios
      .delete(url, config)
      .then(() => {
        toast.success("la agencia se elimino correctamente");
        findAgencias();
        onOpenChange(false);
      })
      .catch((err) => toast.error("Hubo un error al eliminar la agencia"))
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
      {loading && <Loading />}
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Eliminar Agencia {selectAgencia?.nombre_agencia}
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <p>
              ¿Está seguro que quiere eliminar a la agencia{" "}
              {selectAgencia?.nombre_agencia}? Esta acción no se podrá deshacer.
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
export default ModalDeleteAgencia;
