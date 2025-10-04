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

const ModalQuitarBajaColaborador = ({
  isOpen,
  onOpenChange,
  handleFindColaboradores,
  selectColaborador,
}) => {
  const [loading, setLoading] = useState(false);

  const QuitarBaja = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/colaboradores/activar/${
      selectColaborador.id
    }`;

    axios
      .get(url, config)
      .then(() => {
        handleFindColaboradores(), onOpenChange(false);
        toast.success(`La baja se quito  correctamente`);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ||
            "Hubo un error al quitar la baja al colaborador  "
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
          Quitar la baja al colaborador {selectColaborador.nombre_colaborador}
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}
          <div className="w-full flex flex-col  gap-4">
            <p>
              ¿Estás seguro de que deseas quitar la baja al colaborador{" "}
              <strong>
                {selectColaborador.nombre_colaborador}{" "}
                {selectColaborador.apellidos_colaborador}
              </strong>
              ?
            </p>
            <div className="w-full flex items-center justify-end gap-3 p-4">
              <Button
                color="danger"
                type="button"
                onPress={() => {
                  onOpenChange();
                  reset();
                }}
              >
                Cancelar
              </Button>
              <Button color="primary" onPress={QuitarBaja}>
                Quitar baja
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalQuitarBajaColaborador;
