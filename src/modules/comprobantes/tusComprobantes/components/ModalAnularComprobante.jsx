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

const ModalAnularComprobante = ({
  isOpen,
  onOpenChange,
  handleFindComprobantes,
  comprobante,
}) => {
  const deletePost = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/comprobantes/comprobante-electronico/anular/${comprobante?.id}`;
    axios
      .get(url, config)
      .then((res) => {
        toast.success(
          `La ${comprobante.tipoComprobante}, serie: ${comprobante.serie}-
              ${comprobante.numeroSerie}. se anulo correctamente`
        );
        handleFindComprobantes();
        onOpenChange(false);
      })
      .catch((err) => {
        err;

        toast.error("Hubo un error al anular el comprobante");
        onOpenChange(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              ANULAR {comprobante.tipoComprobante}, serie: {comprobante.serie}-
              {comprobante.numeroSerie}
            </ModalHeader>
            <ModalBody>
              <p>
                ¿Está seguro de que deseas anular la
                {comprobante.tipoComprobante}, serie: {comprobante.serie}-
                {comprobante.numeroSerie}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="danger" onClick={deletePost}>
                Anular
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAnularComprobante;
