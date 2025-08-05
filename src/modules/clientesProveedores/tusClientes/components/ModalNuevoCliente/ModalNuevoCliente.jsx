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
import DatosNuevoCliente from "./DatosNuevoCliente";
import UbigeoNuevoCliente from "./UbigeoNuevoCliente";
import axios from "axios";
import config from "../../../../../utils/getToken";
import { toast } from "sonner";

const ModalNuevoCliente = ({ isOpen, onOpenChange, findClients }) => {
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

    if (tipoDoc === "RUC" && dataRuc?.direccion?.length < 3) {
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
      direccion: dataRuc?.direccion,
      telefono: data.telefono,
    };

    const url = `${import.meta.env.VITE_URL_API}/clientes`;

    axios
      .post(url, newData, config)
      .then((res) => {
        setIdDepartamento();
        setIdProvincia();
        setIdDistrito();
        setNumero();
        setNombre();
        reset();
        setDataRuc({ nombre_o_razon_social: "", direccion: "" });
        findClients();
        toast.success("El cliente se ha registrado correctamente");
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.error ||
            "Hubo un error al crear el proveedor por favor verifique bine los datos"
        );
      });
  };

  useEffect(() => {
    if (!isOpen) return;
    setIdDepartamento(null);
    setIdProvincia(null);
    setIdDistrito(null);
    setNumero("");
    setNombre("");
    reset();
    setDataRuc({ nombre_o_razon_social: "", direccion: "" });
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
          Nuevo Cliente
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-2">
            <h2>Ingrese los datos del nuevo cliente</h2>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(submit)}
            >
              <DatosNuevoCliente
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
              <UbigeoNuevoCliente
                register={register}
                errors={errors}
                idDepartamento={idDepartamento}
                setIdDepartamento={setIdDepartamento}
                idProvincia={idProvincia}
                setIdProvincia={setIdProvincia}
                setIdDistrito={setIdDistrito}
                idDistrito={idDistrito}
                dataRuc={dataRuc}
              />
              <div className="w-full flex gap-4">
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Dirección"
                  value={dataRuc?.direccion}
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
              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button color="danger" type="button" onPress={onOpenChange}>
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

export default ModalNuevoCliente;
