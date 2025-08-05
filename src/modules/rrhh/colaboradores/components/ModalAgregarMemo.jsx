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

const ModalAgregarMemo = ({
  isOpen,
  onOpenChange,
  handleFindColaboradores,
  selectColaborador,
}) => {
  const { register, handleSubmit, reset } = useForm();

  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/memos/${
      selectColaborador.id
    }`;
    const formData = new FormData();

    if (data?.documento_memo[0]) {
      formData.append("file", data?.documento_memo[0]);
    }

    axios
      .post(url, formData, config)
      .then(() => {
        handleFindColaboradores(), reset();
        onOpenChange(false);
        toast.success(`El memo se registro correctamente`);
      })
      .catch((err) => {
        console.log(err);

        toast.error(
          err?.response?.data?.message ||
            "Hubo un error al registrar el contrato  "
        );
      })
      .finally(() => setLoading(false));
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
          Agregar memo para el colaborador{" "}
          {selectColaborador.nombre_colaborador}
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}
          <div className="w-full flex flex-col  gap-4">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(submit)}
            >
              <Input
                isRequired
                className="w-full"
                classNames={inputClassNames}
                labelPlacement="outside"
                type="file"
                variant="bordered"
                label="Adjutar memo"
                placeholder="..."
                {...register("documento_memo")}
                radius="sm"
                errorMessage="El archivo  del memo   es obligatorio."
                size="sm"
              />
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

export default ModalAgregarMemo;
