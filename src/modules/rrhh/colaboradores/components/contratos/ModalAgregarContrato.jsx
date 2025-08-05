import React, { useState } from "react";
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
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import config from "../../../../../utils/getToken";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../assets/classNames";
import Loading from "../../../../../hooks/Loading";
import { tipoContratos } from "../../../../../jsons/tipoEmpleosYEducacion";

const ModalAgregarContrato = ({
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
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/contratos/${
      selectColaborador.id
    }`;
    const formData = new FormData();

    formData.append("tipo_contrato", data.tipo_contrato);
    formData.append("fecha_inicio", data.fecha_inicio);
    formData.append("fecha_final", data.fecha_final);

    if (data?.documento_contrato[0]) {
      formData.append("file", data?.documento_contrato[0]);
    }

    axios
      .post(url, formData, config)
      .then(() => {
        handleFindColaboradores(), reset();
        onOpenChange(false);
        toast.success(`El Contrato se registro correctamente`);
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
          Agregar Contrato para {selectColaborador.nombre_colaborador}
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}
          <div className="w-full flex flex-col  gap-4">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(submit)}
            >
              <Select
                isRequired
                className="w-full"
                classNames={{
                  ...selectClassNames,
                }}
                labelPlacement="outside"
                label="Tipo de contrato"
                variant="bordered"
                placeholder="...."
                {...register("tipo_contrato")}
                errorMessage="El  tipo de contrato  es obligatorio."
                radius="sm"
                size="sm"
              >
                {tipoContratos.map((tipoContrato) => (
                  <SelectItem
                    key={tipoContrato.descripcion}
                    value={tipoContrato.descripcion}
                  >
                    {tipoContrato?.descripcion}
                  </SelectItem>
                ))}
              </Select>
              <div className="w-full flex gap-2">
                <Input
                  isRequired
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="date"
                  variant="bordered"
                  label="Fecha de inicio"
                  placeholder="..."
                  {...register("fecha_inicio")}
                  errorMessage="La fecha de inicio  es obligatorio."
                  radius="sm"
                  size="sm"
                />{" "}
                <Input
                  isRequired
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="date"
                  variant="bordered"
                  label="Fecha final"
                  placeholder="..."
                  {...register("fecha_final")}
                  errorMessage="La fecha de final  es obligatorio."
                  radius="sm"
                  size="sm"
                />
              </div>
              <Input
                isRequired
                className="w-full"
                classNames={inputClassNames}
                labelPlacement="outside"
                type="file"
                variant="bordered"
                label="Adjutar contrato"
                placeholder="..."
                {...register("documento_contrato")}
                radius="sm"
                errorMessage="El archivo  del contrato   es obligatorio."
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

export default ModalAgregarContrato;
