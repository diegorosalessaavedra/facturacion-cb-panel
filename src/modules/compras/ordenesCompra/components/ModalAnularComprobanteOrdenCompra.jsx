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

const ModalAnularComprobanteOrdenCompra = ({
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
    }/compras/comprobante/orden-compra/${selectOrdenCompra?.id}`;
    axios
      .delete(url, config)
      .then((res) => {
        toast.success(
          `El comprobante de la orden de compra se anulo correctamente`
        );
        handleFindOrdenCompras();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "hubo un error al registrar el comprobante por favor verifique bien los campos"
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Anular comprobante con la serie {selectOrdenCompra.serie}
            </ModalHeader>
            <ModalBody>
              <p>
                ¿Está seguro de que desea anular el comprobante de la orden de
                compra con la serie {selectOrdenCompra.serie}? Esta acción es
                irreversible .
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                className="text-white"
                color="warning"
                onClick={deletePost}
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

export default ModalAnularComprobanteOrdenCompra;
