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
import config from "../../../utils/getToken";

const ModalEliminarUsuario = ({
  isOpen,
  onOpenChange,
  handleFindUsuarios,
  selectUsuario,
}) => {
  const deletePost = () => {
    const url = `${import.meta.env.VITE_URL_API}/users/${selectUsuario.id}`;
    axios
      .delete(url, config)
      .then((res) => {
        toast.success(
          `El Usuario ${selectUsuario.nombre} se elimino correctamente`
        );
        handleFindUsuarios();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.success("Hubo un error al eliminar el usuario");
        onOpenChange(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Eliminar Usuario
            </ModalHeader>
            <ModalBody>
              <p>
                ¿Está seguro de que desea eliminar al usuario{" "}
                {selectUsuario.nombre}? Esta acción es irreversible y su Usuario
                será eliminada permanentemente. No podrá recuperar la Usuario ni
                su información una vez completada la eliminación.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="danger" onClick={deletePost}>
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalEliminarUsuario;
