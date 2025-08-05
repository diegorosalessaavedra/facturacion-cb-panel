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
import config from "../../../../../../utils/getToken";
import { useState } from "react";
import Loading from "../../../../../../hooks/Loading";

const ModalEliminarDMedico = ({
  isOpen,
  onOpenChange,
  handleFindDescanzoMedicos,
  selectDMedico,
}) => {
  const [loading, setLoading] = useState(false);

  const deletePost = () => {
    setLoading(false);

    const url = `${import.meta.env.VITE_URL_API}/rrhh/descanzo-medico/${
      selectDMedico?.id
    }`;
    axios
      .delete(url, config)
      .then((res) => {
        toast.success(`El descanzo medico se elimino correctamente`);
        handleFindDescanzoMedicos();
        onOpenChange(false);
      })
      .catch((err) => {
        console.log(err);

        toast.error(
          err?.response?.data?.error ||
            "Hubo un error al eliminar el descanzo medico"
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
              Eliminar descanzo medico {selectDMedico?.titulo_descanzo_medico}
            </ModalHeader>
            <ModalBody>
              {loading && <Loading />}

              <p>
                ¿Está seguro de que desea eliminar al descanzo medico{" "}
                {selectDMedico?.titulo_descanzo_medico}? Esta acción es
                irreversible y su descanzo medico será eliminada
                permanentemente.
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

export default ModalEliminarDMedico;
