import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import config from "../../../../utils/getToken";
import { inputClassNames } from "../../../../assets/classNames";

const ModalNuevaCargaLaboral = ({
  isOpen,
  onOpenChange,
  handleFindCargoLaboral,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submit = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/rrhh/cargo-laboral`;
    axios
      .post(url, data, config)
      .then(() => {
        handleFindCargoLaboral(), reset();
        onOpenChange(false);
        toast.success("El cargo laboral  se registro correctamente");
      })
      .catch((err) => {
        toast.error("Hubo un error en registrar al cargo laboral ");
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Agregar nuevo cargo laboral
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col ">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(submit)}
            >
              <div className="w-full flex gap-4">
                <Input
                  isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Cargo"
                  placeholder="..."
                  {...register("cargo", {
                    required: "El  cargo  es obligatorio.",
                  })}
                  isInvalid={!!errors.cargo}
                  color={errors.cargo ? "danger" : "primary"}
                  errorMessage={errors.cargo?.message}
                  radius="sm"
                  size="sm"
                  id="cargo"
                />
              </div>

              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPress={() => {
                    onOpenChange();
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

export default ModalNuevaCargaLaboral;
