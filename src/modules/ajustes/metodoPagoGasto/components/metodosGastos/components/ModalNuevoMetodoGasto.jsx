import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { inputClassNames } from "../../../../../../assets/classNames";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { toast } from "sonner";

const ModalNuevoMetodoGasto = ({
  isOpen,
  onOpenChange,
  getGastos,
  setNumero,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submit = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/metodos-gasto`;
    axios
      .post(url, data, config)
      .then(() => {
        getGastos(), reset();
        onOpenChange(false);
        toast.success("El nuevo  metodo de gasto se agrego correctamente");
      })
      .catch((err) =>
        toast.error("Hubo un error al agregar el nuevo metodo de gasto")
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
          Nuevo método de gasto{" "}
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
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
              />

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

export default ModalNuevoMetodoGasto;
