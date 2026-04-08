import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Checkbox,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react"; // 1. Usamos useEffect para sincronizar datos
import config from "../../../../utils/getToken";
import { inputClassNames } from "../../../../assets/classNames";
import { onInputPrice } from "../../../../assets/onInputs";

const ModalCambiarValidacion = ({
  isOpen,
  onOpenChange,
  handleFindOrdenCompras,
  selectOrdenCompra,
}) => {
  // 2. Estados inicializados con lógica de cortocircuito
  const [montoTxt, setMontoTxt] = useState(0);
  const [validacionFlag, setValidacionFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 3. Estado de carga para el botón

  // 4. Sincronizar el modal con la orden seleccionada cada vez que abra
  useEffect(() => {
    if (isOpen && selectOrdenCompra) {
      setMontoTxt(selectOrdenCompra.monto_txt || 0);
      setValidacionFlag(!!selectOrdenCompra.validacion_flag); // Convierte a booleano real
    }
  }, [isOpen, selectOrdenCompra]);

  const updateValidacion = async () => {
    // 5. Validación simple antes de enviar
    if (!selectOrdenCompra?.id) return;

    setIsLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/compras/orden-compra/validacion/${selectOrdenCompra.id}`;

    try {
      await axios.patch(
        url,
        {
          validacion: !selectOrdenCompra.validacion,
          monto_txt: montoTxt,
          validacion_flag: validacionFlag ? 1 : 0, // 6. Normalización de datos para el backend
        },
        config,
      );

      toast.success(`El SOLPED se actualizó correctamente`);
      handleFindOrdenCompras();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al actualizar el SOLPED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-primary">
              Validación SOLPED
            </ModalHeader>
            <ModalBody>
              <p className="text-default-600">
                {selectOrdenCompra?.validacion
                  ? "¿Está seguro de que quiere desactivar la validación?"
                  : "¿Está seguro de confirmar la validación?"}
              </p>

              {/* Sección de información si ya está validado */}
              {selectOrdenCompra?.validacion ? (
                <div className="p-3 bg-default-100 rounded-lg">
                  <span className="font-semibold">Monto actual:</span> S/{" "}
                  {selectOrdenCompra.monto_txt}
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <Input
                    isRequired
                    classNames={inputClassNames}
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    label="Monto TXT"
                    color="primary"
                    placeholder="0.00"
                    description="Monto exacto que figurará en el TXT"
                    value={montoTxt}
                    onChange={(e) => setMontoTxt(e.target.value)}
                    onInput={onInputPrice}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-tiny text-foreground-500 ml-1">
                      Opciones adicionales
                    </label>
                    <div
                      className={`flex items-center p-3 border-2 rounded-medium transition-all ${
                        validacionFlag
                          ? "border-success bg-success-50"
                          : "border-default-200"
                      }`}
                    >
                      <Checkbox
                        isSelected={validacionFlag}
                        onValueChange={setValidacionFlag}
                        color="success"
                      >
                        <span className="text-small font-medium">
                          Activar Validación Flag
                        </span>
                      </Checkbox>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                isDisabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={updateValidacion}
                isLoading={isLoading} // Feedback visual de carga
                shadow
              >
                Confirmar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCambiarValidacion;
