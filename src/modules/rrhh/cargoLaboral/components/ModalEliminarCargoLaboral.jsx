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

const ModalEliminarCargoLaboral = ({
  isOpen,
  onOpenChange,
  handleFindCargoLaboral,
  selectCargoLaboral,
}) => {
  const deletePost = () => {
    const url = `${import.meta.env.VITE_URL_API}/rrhh/cargo-laboral/${
      selectCargoLaboral.id
    }`;
    axios
      .delete(url, config)
      .then((res) => {
        toast.success(
          `El cargo laboral ${selectCargoLaboral.cago} se elimino correctamente`
        );
        handleFindCargoLaboral();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.success("Hubo un error al eliminar el cargo laboral");
        onOpenChange(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Eliminar cargo laboral
            </ModalHeader>
            <ModalBody>
              <p>
                ¿Está seguro de que desea eliminar el cargo laboral{" "}
                {selectCargoLaboral.cargo}? Esta acción es irreversible y el
                cargo laboral será eliminada permanentemente
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="danger" onPress={deletePost}>
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalEliminarCargoLaboral;
