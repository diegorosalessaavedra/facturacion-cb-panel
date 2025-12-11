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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../assets/classNames";
import axios from "axios";
import config from "../../../../../utils/getToken";
import { toast } from "sonner";
import DatosEditarClientes from "./DatosEditarClientes";
import UbigeoEditarClientes from "./UbigeoEditarClientes";

const ModalEditarClientes = ({
  isOpen,
  onOpenChange,
  findClients,
  selectProveedor,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
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
      eecc: data.eecc,
    };

    const url = `${import.meta.env.VITE_URL_API}/clientes/${
      selectProveedor.id
    }`;

    axios
      .patch(url, newData, config)
      .then((res) => {
        toast.success("Los datos del cliente se actualizaron correctamente");
        findClients();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.error ||
            "Hubo un error al editar el cliente por favor verifique bine los datos"
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
              <DatosEditarClientes
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
                selectProveedor={selectProveedor}
              />
              <UbigeoEditarClientes
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
              <div className="w-full flex gap-2">
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
                <Select
                  className="w-1/3"
                  label="EECC"
                  labelPlacement="outside"
                  variant="bordered"
                  {...register("eecc")}
                  radius="sm"
                  size="sm"
                  classNames={selectClassNames}
                  defaultSelectedKeys={[selectProveedor?.eecc]}
                >
                  <SelectItem key="Activo">Activo</SelectItem>
                  <SelectItem key="Inactivo">Inactivo</SelectItem>
                </Select>
              </div>
              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPress={() => {
                    onOpenChange();
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

export default ModalEditarClientes;
