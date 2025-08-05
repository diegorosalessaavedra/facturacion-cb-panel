import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";

import config from "../../../../utils/getToken";
import Loading from "../../../../hooks/Loading";

const ModalEliminarColaborador = ({
  isOpen,
  onOpenChange,
  handleFindColaboradores,
  selectColaborador,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/colaboradores/${
      selectColaborador.id
    }`;

    axios
      .delete(url, config)
      .then(() => {
        handleFindColaboradores(), onOpenChange(false);
        toast.success(`El colaborador  se elimino correctamente`);
      })
      .catch((err) => {
        console.log(err);

        toast.error(
          err?.response?.data?.message ||
            "Hubo un error al eliminar al colaborador "
        );
      })
      .finally(() => setLoading(false));
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
          Eliminar colaborador {selectColaborador.nombre_colaborador}
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}
          <div className="w-full flex flex-col  gap-4">
            <p>
              ¿Estás seguro de que deseas eliminar al colaborador{" "}
              <strong>
                {selectColaborador.nombre_colaborador}{" "}
                {selectColaborador.apellidos_colaborador}
              </strong>
              ? Esta acción no se puede deshacer y el colaborador será eliminado
              permanentemente de la base de datos.
            </p>
            <div className="w-full flex items-center justify-end gap-3 p-4">
              <Button
                color="primary"
                type="button"
                onPress={() => {
                  onOpenChange();
                  reset();
                }}
              >
                Cancelar
              </Button>
              <Button color="danger" onPress={handleDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalEliminarColaborador;
