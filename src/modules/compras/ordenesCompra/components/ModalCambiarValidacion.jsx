import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import config from "../../../../utils/getToken";
import { inputClassNames } from "../../../../assets/classNames";
import { onInputPrice } from "../../../../assets/onInputs";

const ModalCambiarValidacion = ({
  isOpen,
  onOpenChange,
  handleFindOrdenCompras,
  selectOrdenCompra,
}) => {
  const [montoTxt, setMontoTxt] = useState("");

  const updateValidacion = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/orden-compra/validacion/${selectOrdenCompra.id}`;

    axios
      .patch(
        url,
        { validacion: !selectOrdenCompra.validacion, monto_txt: montoTxt },
        config
      )
      .then((res) => {
        toast.success(`El SOLPED se actualizó correctamente`);
        handleFindOrdenCompras();
        onOpenChange(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Hubo un error al actualizar el SOLPED");
        onOpenChange(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Validación SOLPED
            </ModalHeader>
            <ModalBody>
              <p>
                {selectOrdenCompra.validacion
                  ? "¿Está seguro de que quiere desactivar validación?"
                  : "¿Está seguro de confirmar la validación?"}
              </p>
              {!selectOrdenCompra.validacion && (
                <Input
                  isRequired
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Monto txt"
                  color="primary"
                  errorMessage="El monto txt es obligatorio."
                  description="Monto que pagara en el txt"
                  name="monto_txt"
                  radius="sm"
                  size="sm"
                  value={montoTxt}
                  onChange={(e) => setMontoTxt(e.target.value)}
                  onInput={onInputPrice}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={updateValidacion}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCambiarValidacion;
