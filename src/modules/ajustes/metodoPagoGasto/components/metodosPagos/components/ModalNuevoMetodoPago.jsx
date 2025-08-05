import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../../assets/classNames";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { toast } from "sonner";

const ModalNuevoMetodoPago = ({ isOpen, onOpenChange, handleFindPagos }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submit = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/metodos-pago`;
    axios
      .post(url, data, config)
      .then((res) => {
        handleFindPagos(), reset();
        onOpenChange(false);
        toast.success("El nuevo  metodo de pago se agrego correctamente");
      })
      .catch((err) =>
        toast.error("Hubo un error al agregar el nuevo metodo de pago")
      );
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
          Nuevo método de pago{" "}
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-4">
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(submit)}
            >
              <Input
                className="w-full"
                classNames={inputClassNames}
                labelPlacement="outside"
                type="text"
                variant="bordered"
                label="Descripción"
                placeholder="..."
                {...register("descripcion", {
                  required: "El teléfono es obligatorio.",
                })}
                isInvalid={!!errors.descripcion}
                color={errors.descripcion ? "danger" : "primary"}
                errorMessage={errors.descripcion?.message}
                radius="sm"
                size="sm"
                id="descripcion"
              />

              <Select
                className="w-full "
                isRequired
                classNames={{
                  ...selectClassNames,
                }}
                labelPlacement="outside"
                label="Tipo de pago "
                variant="bordered"
                {...register("condicionPago", {
                  required: "La condicion de Pago es obligatorio.",
                })}
                isInvalid={!!errors?.condicionPago}
                color={errors?.condicionPago ? "danger" : "primary"}
                errorMessage={errors?.condicionPago?.message}
                radius="sm"
                size="sm"
                defaultSelectedKeys={["Contado"]}
              >
                <SelectItem key="Contado" value="Contado">
                  Contado
                </SelectItem>
                <SelectItem key="Crédito" value="Crédito">
                  Crédito
                </SelectItem>
              </Select>

              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPress={onOpenChange}
                  onClick={() => {
                    setNumero("");
                    setDataDni({ nombre_completo: null });
                    setDataRuc({ nombre_o_razon_social: null });
                    reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button color="primary" type="submit">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalNuevoMetodoPago;
