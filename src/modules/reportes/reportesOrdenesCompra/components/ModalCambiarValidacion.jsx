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

const ModalCambiarValidacion = ({
  isOpen,
  onOpenChange,
  handleFindoOrdenesCompra,
  selectOrdenCompra,
}) => {
  const deletePost = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/orden-compra/validacion-ingrid/${selectOrdenCompra.id}`;
    axios
      .patch(
        url,
        { validacion_ingrid: !selectOrdenCompra.validacion_ingrid },
        config
      )
      .then((res) => {
        toast.success(`El SOLPED se actualizo correctamente`);
        handleFindoOrdenesCompra();
        onOpenChange(false);
      })
      .catch((err) => {
        console.log(err);

        toast.error("Hubo un error al actualizar el SOLPED");
        onOpenChange(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Validación SOLPED
            </ModalHeader>
            <ModalBody>
              <p>
                {selectOrdenCompra.validacion
                  ? "¿Está seguro de que quiere desactivar validacion? "
                  : "¿Está seguro de  confirmar la validacion? "}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={deletePost}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCambiarValidacion;
