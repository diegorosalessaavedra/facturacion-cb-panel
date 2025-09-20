import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import config from "../../../../../../utils/getToken";
import Loading from "../../../../../../hooks/Loading";
import { FaTrash } from "react-icons/fa";

const EliminarBloque = ({ bloque, index }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const handleEliminarBloque = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/bloque-despacho/${bloque.id}`;

    axios
      .delete(url, config)
      .then((res) => {})
      .finally(() => {
        setLoading(false);
        onOpenChange(false);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <Button color="danger" size="sm" onPress={onOpen}>
        <FaTrash /> BLOQUE
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Eliminar Bloque
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Está seguro de que desea eliminar el bloque{" "}
                  {bloque.nombre_bloque}? Esta acción es irreversible y el
                  bloque será eliminada permanentemente
                </p>{" "}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleEliminarBloque}>
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EliminarBloque;
