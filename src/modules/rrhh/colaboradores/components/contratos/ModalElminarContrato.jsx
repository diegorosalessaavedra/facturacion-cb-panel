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
import { useState } from "react";
import Loading from "../../../../../hooks/Loading";
import config from "../../../../../utils/getToken";

const ModalElminarContrato = ({
  isOpen,
  onOpenChange,
  handleFindColaboradores,
  selectContrato,
  selectColaborador,
}) => {
  const [loading, setLoading] = useState(false);

  const deletePost = () => {
    setLoading(false);

    const url = `${import.meta.env.VITE_URL_API}/rrhh/contratos/${
      selectContrato?.id
    }`;
    axios
      .delete(url, config)
      .then((res) => {
        toast.success(`El contrato se elimino correctamente`);
        handleFindColaboradores();
        onOpenChange(false);
      })
      .catch((err) => {
        console.log(err);

        toast.error(
          err?.response?.data?.message ||
            "Hubo un error al eliminar el contrato "
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
              Eliminar contrato del colaborador{" "}
              {selectColaborador.nombre_colaborador}{" "}
              {selectColaborador.apellidos_colaborador}
            </ModalHeader>
            <ModalBody>
              {loading && <Loading />}

              <p>
                ¿Está seguro de que desea eliminar el contrato del colaborador
                {selectColaborador.nombre_colaborador}{" "}
                {selectColaborador.apellidos_colaborador}? Esta acción es
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

export default ModalElminarContrato;
