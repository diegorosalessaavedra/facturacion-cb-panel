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
import { inputClassNames, selectClassNames } from "../../../assets/classNames";
import { onInputNumber } from "../../../assets/onInputs";
import config from "../../../utils/getToken";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ModalEditarUsuario = ({
  isOpen,
  onOpenChange,
  handleFindUsuarios,
  selectUsuario,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isVisible, setIsVisible] = useState(false);
  const [dataSelects, setDataSelects] = useState({ role: selectUsuario.role });

  const submit = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/users/${selectUsuario.id}`;

    axios
      .patch(url, { ...data, role: dataSelects.role }, config)
      .then(() => {
        handleFindUsuarios(), reset();
        onOpenChange(false);
        toast.success(`Los datos del usuario se edito correctamente`);
      })
      .catch((err) => {
        toast.error("Hubo un error en editar el usuario ");
      });
  };
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Editar Usuario
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
                  label="Nombre"
                  placeholder="..."
                  {...register("nombre", {
                    required: "El  nombre  es obligatorio.",
                  })}
                  isInvalid={!!errors.nombre}
                  color={errors.nombre ? "danger" : "primary"}
                  errorMessage={errors.nombre?.message}
                  defaultValue={selectUsuario?.nombre}
                  radius="sm"
                  size="sm"
                  id="nombreUsuario"
                />

                <Input
                  isRequired
                  className="min-w-52 max-w-52"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="DNI"
                  placeholder="..."
                  {...register("dni", {
                    required: "El dni es obligatorio.",
                  })}
                  isInvalid={!!errors.dni}
                  color={errors.dni ? "danger" : "primary"}
                  errorMessage={errors.dni?.message}
                  radius="sm"
                  size="sm"
                  id="dniUsuario"
                  onInput={onInputNumber}
                  defaultValue={Number(selectUsuario?.dni)}
                />
              </div>
              <div className="w-full flex gap-4">
                <Input
                  isRequired
                  className="min-w-52 max-w-52"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Teléfono"
                  maxLength={9}
                  placeholder="..."
                  {...register("celular", {
                    required: "El Teléfono es obligatorio.",
                    minLength: {
                      value: 9,
                      message: "El Teléfono debe tener al menos 9 caracteres.",
                    },
                  })}
                  isInvalid={!!errors.celular}
                  color={errors.celular ? "danger" : "primary"}
                  errorMessage={errors.celular?.message}
                  defaultValue={Number(selectUsuario?.celular)}
                  radius="sm"
                  size="sm"
                  id="celularUsuario"
                  onInput={onInputNumber}
                />

                <Select
                  isRequired
                  className="w-full"
                  label="Rol"
                  labelPlacement="outside"
                  {...register("role")}
                  isInvalid={!!errors.role}
                  color={errors.role ? "danger" : "primary"}
                  errorMessage={errors.role?.message}
                  id="incluyeIgv"
                  variant="bordered"
                  radius="sm"
                  classNames={selectClassNames}
                  value={dataSelects.role}
                  defaultSelectedKeys={[selectUsuario?.role]}
                  onChange={(e) =>
                    setDataSelects({
                      ...dataSelects,
                      role: e.target.value,
                    })
                  }
                >
                  <SelectItem key="GERENTE">GERENTE</SelectItem>
                  <SelectItem key="VENDEDOR">VENDEDOR</SelectItem>
                  <SelectItem key="CONTADOR">CONTADOR</SelectItem>
                  <SelectItem key="PRACTICANTE CONTABLE">
                    PRACTICANTE CONTABLE
                  </SelectItem>
                  <SelectItem key="COMPRADOR/VENDEDOR">
                    COMPRADOR/VENDEDOR
                  </SelectItem>
                  <SelectItem key="RRHH">RRHH</SelectItem>
                </Select>
              </div>

              <div className="w-full flex gap-4">
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  variant="bordered"
                  label="Nueva Contraseña"
                  placeholder="..."
                  {...register("newPassword")}
                  radius="sm"
                  size="sm"
                  id="passwordUsuario"
                  type={isVisible ? "text" : "password"}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label="toggle password visibility"
                    >
                      {isVisible ? (
                        <FaEyeSlash className="text-2xl text-blue-600 pointer-events-none flex-shrink-0" />
                      ) : (
                        <FaEye className="text-2xl text-blue-600 pointer-events-none flex-shrink-0" />
                      )}
                    </button>
                  }
                />
              </div>

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

export default ModalEditarUsuario;
