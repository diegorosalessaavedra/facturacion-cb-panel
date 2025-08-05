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
} from "../../../../assets/classNames";
import axios from "axios";
import config from "../../../../utils/getToken";
import { toast } from "sonner";

const ModalNuevoEncargado = ({
  isOpen,
  onOpenChange,
  handleFindEncargados,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submit = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/encargado`;
    axios
      .post(url, data, config)
      .then((res) => {
        handleFindEncargados(), reset();
        onOpenChange(false);
        toast.success("El encargado se agrego correctamente");
      })
      .catch((err) => toast.error("Hubo un error al agregar el encargado"));
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
          Nuevo Encargado
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
                label="Nombre"
                placeholder="..."
                {...register("nombre", {
                  required: "El teléfono es obligatorio.",
                })}
                isInvalid={!!errors.nombre}
                color={errors.nombre ? "danger" : "primary"}
                errorMessage={errors.nombre?.message}
                radius="sm"
                size="sm"
                id="nombre"
              />

              <Select
                className="w-full "
                isRequired
                classNames={{
                  ...selectClassNames,
                }}
                labelPlacement="outside"
                label="Cargo"
                variant="bordered"
                {...register("cargo", {
                  required: "El cargo es obligatorio.",
                })}
                isInvalid={!!errors?.cargo}
                color={errors?.cargo ? "danger" : "primary"}
                errorMessage={errors?.cargo?.message}
                radius="sm"
                size="sm"
                defaultSelectedKeys={["Vendedor"]}
              >
                <SelectItem key="Vendedor" value="Vendedor">
                  Vendedor
                </SelectItem>
                <SelectItem key="Comprador" value="Comprador">
                  Comprador
                </SelectItem>
                <SelectItem key="Autorizado" value="Autorizado">
                  Autorizado
                </SelectItem>
              </Select>

              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPress={onOpenChange}
                  onClick={() => {
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

export default ModalNuevoEncargado;
