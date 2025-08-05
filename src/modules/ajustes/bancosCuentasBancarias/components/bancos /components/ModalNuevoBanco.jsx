import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../../../utils/getToken";
import { inputClassNames } from "../../../../../../assets/classNames";

const ModalNuevoBanco = ({ isOpen, onOpenChange, handleFindBancos }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submit = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/bancos`;
    axios
      .post(url, data, config)
      .then(() => {
        handleFindBancos(), reset();
        onOpenChange(false);
        toast.success("El Banco  se agrego correctamente");
      })
      .catch((err) => {
        toast.error("Hubo un error al agregar el Banco ");
      });
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
          Agregar nuevo Banco
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
                label="Nombre Del Banco"
                placeholder="..."
                {...register("nombreBanco", {
                  required: "La nombreBanco es obligatorio.",
                })}
                isInvalid={!!errors.nombreBanco}
                color={errors.nombreBanco ? "danger" : "primary"}
                errorMessage={errors.nombreBanco?.message}
                radius="sm"
                size="sm"
                id="nombreBanco"
              />

              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPress={onOpenChange}
                  onClick={() => reset()}
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

export default ModalNuevoBanco;
