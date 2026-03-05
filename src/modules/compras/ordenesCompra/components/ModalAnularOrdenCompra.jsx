import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../utils/getToken";
import { handleAxiosError } from "../../../../utils/handleAxiosError";

const ModalAnularOrdenCompra = ({
  isOpen,
  onOpenChange,
  handleFindOrdenCompras,
  selectOrdenCompra,
  setLoading,
}) => {
  const deletePost = () => {
    setLoading(true);

    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/orden-compra/anular/${selectOrdenCompra?.id}`;
    axios
      .delete(url, config)
      .then((res) => {
        toast.success(`El SOLPED se anulo correctamente`);
        handleFindOrdenCompras();
        onOpenChange(false);
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Anular SOLPED
            </ModalHeader>
            <ModalBody>
              <p>
                ¿Está seguro de que desea anular el SOLPED del proveedor{" "}
                {selectOrdenCompra.proveedor.nombreApellidos ||
                  selectOrdenCompra.proveedor.nombreComercial}
                ? Esta acción es irreversible .
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                className="text-white"
                color="danger"
                onPress={deletePost}
              >
                Anular
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAnularOrdenCompra;
