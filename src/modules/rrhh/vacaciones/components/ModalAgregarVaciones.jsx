import React, { useState } from "react";
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
import Loading from "../../../../hooks/Loading";
import { onInputNumber } from "../../../../assets/onInputs";

const ModalAgregarVaciones = ({
  isOpen,
  onOpenChange,
  handleFindColaboradores,
  selectColaborador,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(false);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/vacaciones/${
      selectColaborador?.id
    }`;

    axios
      .post(url, data, config)
      .then(() => {
        handleFindColaboradores(), reset();
        onOpenChange(false);
        toast.success(`el periodo de vacaciones registro correctamente`);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ||
            "Hubo un error al registrar el periodo de vacaciones  "
        );
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Agregar Periodo de vacaiones para{" "}
          {selectColaborador?.nombre_colaborador}
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}
          <div className="w-full flex flex-col ">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(submit)}
            >
              <div className="w-full flex flex-col gap-2">
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  label="Perido"
                  variant="Perido"
                  placeholder="..."
                  {...register("periodo", {
                    required: "El periodo es obligatorio.",
                  })}
                  isInvalid={!!errors.periodo}
                  color={errors.periodo ? "danger" : "primary"}
                  errorMessage={errors.periodo?.message}
                  onInput={onInputNumber}
                  radius="sm"
                  size="sm"
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

export default ModalAgregarVaciones;
