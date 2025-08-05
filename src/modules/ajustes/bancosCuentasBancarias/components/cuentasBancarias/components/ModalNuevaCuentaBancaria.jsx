import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../../../utils/getToken";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../../assets/classNames";

const ModalNuevaCuentaBancaria = ({
  isOpen,
  onOpenChange,
  handleFindCuentasBancarias,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [bancos, setBancos] = useState([]);
  const [selectBanco, setSelectBanco] = useState();

  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/bancos`;

    axios.get(url, config).then((res) => {
      setBancos(res.data.bancos);
      setSelectBanco(res.data.bancos[0]?.id);
    });
  }, []);

  const handleSelectBanco = (e) => {
    setSelectBanco(e.target.value);
  };

  const submit = (data) => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/ajustes/cuentas-banco/${selectBanco}`;
    axios
      .post(url, data, config)
      .then(() => {
        handleFindCuentasBancarias(), reset();
        onOpenChange(false);
        toast.success("El banco se agrego correctamente");
      })
      .catch((err) => {
        toast.error(
          "Hubo un error al agregar el banco, verifique bien los datos"
        );
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
          Nueva Cuenta Bancaria{" "}
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            {bancos.length > 0 ? (
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(submit)}
              >
                <Select
                  className="w-full noLabel"
                  isRequired
                  classNames={{
                    ...selectClassNames,
                  }}
                  labelPlacement="outside"
                  label="Seleccione un Banco"
                  placeholder="..."
                  variant="bordered"
                  radius="sm"
                  size="sm"
                  id="bancoId"
                  defaultSelectedKeys={[`${bancos[0]?.id}`]}
                  onChange={handleSelectBanco}
                >
                  {bancos?.map((banco) => (
                    <SelectItem
                      key={banco.id}
                      textValue={banco.nombreBanco}
                      value={banco.id}
                    >
                      {banco.nombreBanco}
                    </SelectItem>
                  ))}
                </Select>
                <div className="flex gap-4">
                  <Input
                    className="w-full"
                    classNames={inputClassNames}
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    label="Descripción"
                    placeholder="..."
                    {...register("descripcion", {
                      required: "La descripcion es obligatorio.",
                    })}
                    isInvalid={!!errors.descripcion}
                    color={errors.descripcion ? "danger" : "primary"}
                    errorMessage={errors.descripcion?.message}
                    radius="sm"
                    size="sm"
                    id="DescripciónBanco"
                  />
                  <Select
                    className="min-w-52 max-w-52 "
                    label="Moneda"
                    labelPlacement="outside"
                    {...register("moneda", {
                      required: "El tipo de moneda es obligatoria.",
                    })}
                    isInvalid={!!errors.moneda}
                    color={errors.moneda ? "danger" : "primary"}
                    errorMessage={errors.moneda?.message}
                    id="moneda"
                    variant="bordered"
                    defaultSelectedKeys={["Soles"]}
                    radius="sm"
                    classNames={selectClassNames}
                  >
                    <SelectItem key="Soles">Soles</SelectItem>
                    <SelectItem key="Dólares Americanos">
                      Dólares Americanos
                    </SelectItem>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Input
                    className="w-full"
                    classNames={inputClassNames}
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    label="CCI"
                    placeholder="..."
                    {...register("cci", {
                      required: "El cci es obligatorio.",
                    })}
                    isInvalid={!!errors.cci}
                    color={errors.cci ? "danger" : "primary"}
                    errorMessage={errors.cci?.message}
                    radius="sm"
                    size="sm"
                    id="cciCuentaBanco"
                  />
                  <Input
                    className="w-full"
                    classNames={inputClassNames}
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    label="Número de cuenta"
                    placeholder="..."
                    {...register("numero", {
                      required: "El numero es obligatorio.",
                    })}
                    isInvalid={!!errors.numero}
                    color={errors.numero ? "danger" : "primary"}
                    errorMessage={errors.numero?.message}
                    radius="sm"
                    size="sm"
                    id="numeroCuentaBanco"
                  />
                </div>

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
            ) : (
              <p>
                Para poder agregar una cuenta bancaria necesita tener almenos un
                banco registrado
              </p>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalNuevaCuentaBancaria;
