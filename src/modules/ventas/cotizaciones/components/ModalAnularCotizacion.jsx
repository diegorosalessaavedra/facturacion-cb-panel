import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import React from "react";
import { toast } from "sonner";
import config from "../../../../utils/getToken";
import { formatWithLeadingZeros } from "../../../../assets/formats";

const ModalAnularCotizacion = ({
  isOpen,
  onOpenChange,
  handleFindCotizaciones,
  selectCotizacion,
  setLoading,
}) => {
  const deletePost = () => {
    setLoading(true);

    const url = `${import.meta.env.VITE_URL_API}/ventas/cotizaciones/${
      selectCotizacion?.id
    }`;
    axios
      .delete(url, config)
      .then((res) => {
        toast.success(`La cotización se anulo correctamente`);
        handleFindCotizaciones();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "hubo un error al anular la cotización por favor verifique bien los campos"
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
              Anular cotización COT-
              {formatWithLeadingZeros(selectCotizacion?.id, 6)}
            </ModalHeader>
            <ModalBody>
              <p>
                ¿Está seguro de que desea anular la cotización compra con la
                serie COT-
                {formatWithLeadingZeros(selectCotizacion?.id, 6)}? Esta acción
                es irreversible .
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                className="text-white"
                color="warning"
                onClick={deletePost}
              >
                Anular
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAnularCotizacion;
