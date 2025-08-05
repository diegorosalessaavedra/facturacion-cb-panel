import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  inputClassNames,
  preventNonNumericInput,
} from "../../../../../assets/classNames";
import axios from "axios";
import config from "../../../../../utils/getToken";
import { toast } from "sonner";
import DatosEditarProveedor from "./DatosEditarProveedor";
import UbigeoEditarProveedor from "./UbigeoEditarProveedor";

const ModalEditarProveedor = ({
  isOpen,
  onOpenChange,
  findProveedores,
  selectProveedor,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const [idDepartamento, setIdDepartamento] = useState();
  const [idProvincia, setIdProvincia] = useState();
  const [idDistrito, setIdDistrito] = useState();
  const [numero, setNumero] = useState("");
  const [dataRuc, setDataRuc] = useState({
    nombre_o_razon_social: "",
    direccion: "",
  });
  const [tipoDoc, setTipoDoc] = useState("DNI");
  const [nombre, setNombre] = useState();

  const submit = (data) => {
    if (tipoDoc === "DNI" && !nombre) {
      setError("nombre", { message: "El nombre es obligatorio." });
      return;
    }

    if (tipoDoc === "RUC" && dataRuc.nombre_o_razon_social.length < 3) {
      setError("nombreComercial", {
        message: "La Razon social es obligatoria",
      });
      return;
    }

    if (tipoDoc === "RUC" && dataRuc.direccion.length < 3) {
      setError("direccion", {
        message: "La dirección social es obligatoria",
      });
      return;
    }
    const newData = {
      tipoDocIdentidad: tipoDoc,
      numeroDoc: numero,
      nombreApellidos: nombre,
      nombreComercial: dataRuc.nombre_o_razon_social,
      departamentoId: idDepartamento,
      provinciaId: idProvincia,
      distritoId: idDistrito,
      direccion: dataRuc.direccion,
      telefono: data.telefono,
      banco_beneficiario: data.banco_beneficiario,
      nro_cuenta_bco: data.nro_cuenta_bco,
    };

    const url = `${import.meta.env.VITE_URL_API}/proveedores/${
      selectProveedor.id
    }`;

    axios
      .patch(url, newData, config)
      .then((res) => {
        toast.success("Los datos del proveedor se actualizaron correctamente");
        findProveedores();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.error ||
            "Hubo un error al editar el proveedor por favor verifique bine los datos"
        );
      });
  };

  useEffect(() => {
    if (!isOpen) return;
    setTipoDoc(selectProveedor.tipoDocIdentidad);
    setIdDepartamento();
    setIdProvincia();
    setIdDistrito();
    setNumero(selectProveedor.numeroDoc);
    setNombre(selectProveedor.nombreApellidos);

    setDataRuc({
      nombre_o_razon_social: selectProveedor.nombreComercial,
      direccion: selectProveedor.direccion,
    });
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="3xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Editar Proveedor
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(submit)}
            >
              <DatosEditarProveedor
                register={register}
                errors={errors}
                numero={numero}
                tipoDoc={tipoDoc}
                setTipoDoc={setTipoDoc}
                setNumero={setNumero}
                dataRuc={dataRuc}
                setDataRuc={setDataRuc}
                nombre={nombre}
                setNombre={setNombre}
              />
              <UbigeoEditarProveedor
                register={register}
                errors={errors}
                idDepartamento={idDepartamento}
                setIdDepartamento={setIdDepartamento}
                idProvincia={idProvincia}
                setIdProvincia={setIdProvincia}
                setIdDistrito={setIdDistrito}
                idDistrito={idDistrito}
                dataRuc={dataRuc}
                selectProveedor={selectProveedor}
              />
              <div className="w-full flex gap-4">
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Dirección"
                  value={dataRuc.direccion}
                  placeholder="..."
                  {...register("direccion", {
                    onChange: (e) =>
                      setDataRuc((prev) => ({
                        ...prev,
                        direccion: e.target.value,
                      })),
                  })}
                  isInvalid={!!errors.direccion}
                  color={errors.direccion ? "danger" : "primary"}
                  errorMessage={errors.direccion?.message}
                  radius="sm"
                  size="sm"
                />
              </div>
              <div className="w-full flex gap-4">
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Banco del beneficiario"
                  placeholder="..."
                  {...register("banco_beneficiario")}
                  defaultValue={selectProveedor.banco_beneficiario}
                  color="primary"
                  errorMessage="banco del beneficiario es obligatorio."
                  radius="sm"
                  size="sm"
                />
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Numero de cuenta bco"
                  placeholder="..."
                  {...register("nro_cuenta_bco")}
                  defaultValue={selectProveedor.nro_cuenta_bco}
                  color="primary"
                  errorMessage="Numero de cuenta bco es obligatorio."
                  radius="sm"
                  size="sm"
                />
              </div>
              <div className="w-full flex gap-4">
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Banco del beneficiario 2"
                  placeholder="..."
                  {...register("banco_beneficiario_2")}
                  defaultValue={selectProveedor.banco_beneficiario_2}
                  color="primary"
                  radius="sm"
                  size="sm"
                />
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Numero de cuenta bco 2"
                  placeholder="..."
                  {...register("nro_cuenta_bco_2")}
                  defaultValue={selectProveedor.nro_cuenta_bco_2}
                  color="primary"
                  radius="sm"
                  size="sm"
                />
              </div>
              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPres={() => {
                    setNumero("");
                    setDataDni({ nombre_completo: null });
                    setDataRuc({ nombre_o_razon_social: null });
                    reset();
                    onOpenChange(false);
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

export default ModalEditarProveedor;
