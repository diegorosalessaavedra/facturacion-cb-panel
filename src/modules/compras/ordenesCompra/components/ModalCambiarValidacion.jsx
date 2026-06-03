import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Checkbox,
  Divider,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import config from "../../../../utils/getToken";
import { inputClassNames } from "../../../../assets/classNames";
import { onInputPrice } from "../../../../assets/onInputs";
import { formatNumber } from "../../../../assets/formats";

const ModalCambiarValidacion = ({
  isOpen,
  onOpenChange,
  handleFindOrdenCompras,
  selectOrdenCompra,
}) => {
  const [montoTxt, setMontoTxt] = useState(0);
  const [validacionFlag, setValidacionFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Nuevo estado para controlar el modal de advertencia
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (isOpen && selectOrdenCompra) {
      setMontoTxt(selectOrdenCompra.monto_txt || 0);
      setValidacionFlag(!!selectOrdenCompra.validacion_flag);
    }
  }, [isOpen, selectOrdenCompra]);

  // Cálculos seguros
  const saldoNeto =
    Number(selectOrdenCompra?.saldo || 0) -
    Number(selectOrdenCompra?.detraccion?.monto_detraccion || 0);

  const saldoAcumulado = Number(
    selectOrdenCompra?.proveedor?.saldo_acumulado || 0,
  );

  // 1. Función que evalúa la lógica antes de enviar
  const handlePreSubmit = () => {
    // Si estamos desactivando, no necesitamos validar el monto, pasamos directo
    if (selectOrdenCompra?.validacion) {
      executeValidation();
      return;
    }

    // Comparamos los montos (usamos toFixed(2) para evitar problemas de decimales en JS)
    const inputMonto = Number(montoTxt) || 0;
    if (inputMonto.toFixed(2) !== saldoNeto.toFixed(2)) {
      // Si son diferentes, abrimos la alerta
      setIsAlertOpen(true);
    } else {
      // Si son iguales, ejecutamos la actualización
      executeValidation();
    }
  };

  // 2. Función que realmente hace la llamada a la API
  const executeValidation = async () => {
    if (!selectOrdenCompra?.id) return;

    setIsLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/compras/orden-compra/validacion/${selectOrdenCompra.id}`;

    try {
      await axios.patch(
        url,
        {
          validacion: !selectOrdenCompra.validacion,
          monto_txt: montoTxt,
          validacion_flag: validacionFlag,
        },
        config,
      );

      toast.success(`El SOLPED se actualizó correctamente`);
      handleFindOrdenCompras();
      setIsAlertOpen(false); // Cerramos la alerta si estaba abierta
      onOpenChange(false); // Cerramos el modal principal
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al actualizar el SOLPED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Modal Principal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) setIsAlertOpen(false); // Resetear alerta al cerrar
          onOpenChange(open);
        }}
        backdrop="blur"
        placement="center"
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-2">
                <h2 className="text-xl font-bold text-slate-800">
                  Validación SOLPED
                </h2>
                <p className="text-xs font-normal text-slate-500">
                  {selectOrdenCompra?.validacion
                    ? "Revertir validación de orden de compra"
                    : "Configurar montos y parámetros para TXT"}
                </p>
              </ModalHeader>

              <ModalBody className="pt-0">
                {/* Tarjetas de Resumen Financiero */}
                <div className="flex gap-3 w-full my-3">
                  <div className="flex-1 bg-primary-50 border border-primary-100 rounded-xl p-3 flex flex-col items-start justify-center">
                    <span className="text-[10px] text-primary-600 font-semibold uppercase tracking-wider">
                      INSTRUCCIÓN DE PAGO
                    </span>
                    <span className="text-lg font-bold text-primary-800">
                      S/ {formatNumber(saldoNeto)}
                    </span>
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-start justify-center">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      SALDO ACUMULADO
                    </span>
                    <span className="text-lg font-bold text-slate-700">
                      S/ {formatNumber(saldoAcumulado)}
                    </span>
                  </div>
                </div>

                <Divider className="mb-2" />

                {/* Lógica de Renderizado Condicional */}
                {selectOrdenCompra?.validacion ? (
                  <div className="flex flex-col items-center justify-center p-4 bg-danger-50 text-danger-700 rounded-xl border border-danger-100 text-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-danger"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <line x1="12" x2="12" y1="9" y2="13" />
                      <line x1="12" x2="12.01" y1="17" y2="17" />
                    </svg>
                    <div>
                      <p className="font-semibold text-sm">
                        ¿Seguro que desea desactivar esta validación?
                      </p>
                      <p className="text-xs mt-1">
                        El monto validado actual es de{" "}
                        <span className="font-bold">
                          S/ {formatNumber(selectOrdenCompra.monto_txt)}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 mt-2">
                    <Input
                      isRequired
                      classNames={inputClassNames}
                      labelPlacement="outside"
                      type="text"
                      variant="bordered"
                      label="Monto para TXT"
                      color="primary"
                      placeholder="0.00"
                      description="Monto exacto que figurará en el archivo de texto."
                      value={montoTxt}
                      onChange={(e) => setMontoTxt(e.target.value)}
                      onInput={onInputPrice}
                      size="md"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small font-medium">
                            S/
                          </span>
                        </div>
                      }
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground-700">
                        Opciones adicionales
                      </label>
                      <div
                        className={`flex flex-col p-3 border-2 rounded-xl transition-colors cursor-pointer ${
                          validacionFlag
                            ? "border-primary bg-primary-50/50"
                            : "border-default-200 bg-transparent hover:bg-default-50"
                        }`}
                        onClick={() => setValidacionFlag(!validacionFlag)}
                      >
                        <Checkbox
                          isSelected={validacionFlag}
                          onValueChange={setValidacionFlag}
                          color="primary"
                          classNames={{
                            label: "w-full",
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                              Activar Validación Flag
                            </span>
                            <span className="text-xs text-default-400">
                              Considerar únicamente entre cuentas BCP.
                            </span>
                          </div>
                        </Checkbox>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="border-t border-slate-100 mt-2">
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isLoading}
                  className="font-medium"
                >
                  Cancelar
                </Button>
                <Button
                  color={selectOrdenCompra?.validacion ? "danger" : "primary"}
                  onPress={handlePreSubmit} // Usamos la nueva función
                  isLoading={isLoading}
                  shadow
                  className="font-medium"
                >
                  {selectOrdenCompra?.validacion
                    ? "Desactivar"
                    : "Confirmar Validación"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Secundario de Advertencia */}
      <Modal
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        backdrop="opaque"
        placement="center"
        size="sm"
        classNames={{
          backdrop: "bg-black/50 backdrop-opacity-40",
        }}
      >
        <ModalContent>
          {(onCloseAlert) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-0">
                <div className="flex items-center gap-2 text-warning-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" x2="12" y1="9" y2="13" />
                    <line x1="12" x2="12.01" y1="17" y2="17" />
                  </svg>
                  <h2 className="text-lg font-bold">Diferencia de Montos</h2>
                </div>
              </ModalHeader>
              <ModalBody className="py-4">
                <p className="text-sm text-slate-600">
                  Has registrado un monto para el TXT de{" "}
                  <span className="font-bold text-slate-800">
                    S/ {formatNumber(Number(montoTxt))}
                  </span>
                  , pero la instrucción de pago indica{" "}
                  <span className="font-bold text-slate-800">
                    S/ {formatNumber(saldoNeto)}
                  </span>
                  .
                </p>
                <p className="text-sm font-medium text-slate-700 mt-2">
                  ¿Deseas continuar con la validación de todas formas?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="flat"
                  onPress={onCloseAlert}
                  isDisabled={isLoading}
                >
                  Cancelar Validación
                </Button>
                <Button
                  color="warning"
                  onPress={executeValidation}
                  isLoading={isLoading}
                  className="font-medium text-white shadow-md"
                >
                  Continuar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalCambiarValidacion;
