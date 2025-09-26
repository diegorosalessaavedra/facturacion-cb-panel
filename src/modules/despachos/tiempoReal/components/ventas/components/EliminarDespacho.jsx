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

const EliminarDespacho = ({ despachoId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const handleEliminarDespacho = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/despacho/${despachoId}`;

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
      <button
        className="w-6 h-6 bg-red-500  flex items-center justify-center rounded-md "
        onClick={onOpen}
      >
        <FaTrash className="text-white text-xs" />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Eliminar Despacho
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Está seguro de que desea eliminar el Despacho ? Esta acción
                  es irreversible y el cargo laboral será eliminada
                  permanentemente
                </p>{" "}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleEliminarDespacho}>
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

export default EliminarDespacho;
