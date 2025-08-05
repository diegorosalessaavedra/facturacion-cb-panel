import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import config from "../../../utils/getToken";
import { toast } from "sonner";

const ModalEliminarProducto = ({
  isOpen,
  onOpenChange,
  handleFindProductos,
  selectProducto,
}) => {
  const handleDelete = () => {
    const url = `${import.meta.env.VITE_URL_API}/productos/mis-productos/${
      selectProducto?.id
    }`;
    axios
      .delete(url, config)
      .then(() => {
        toast.success("El producto se elimino correctamente");
        handleFindProductos();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error("Hubo un error al eliminar el producto");
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
          Eliminar Producto
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <p>
              ¿Está seguro que quiere eliminar el producto{" "}
              {selectProducto?.nombre}
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
export default ModalEliminarProducto;
