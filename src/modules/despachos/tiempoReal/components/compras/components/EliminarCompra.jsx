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

const EliminarCompra = ({ compraId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const handleEliminarCompra = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/compra-despacho/${compraId}`;

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
                Eliminar Compra
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Está seguro de que desea eliminar la Compra ? Esta acción es
                  irreversible y el cargo laboral será eliminada permanentemente
                </p>{" "}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleEliminarCompra}>
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

export default EliminarCompra;
