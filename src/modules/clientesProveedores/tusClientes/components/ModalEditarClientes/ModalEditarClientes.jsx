import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Select,
  SelectItem,
  Checkbox, // 1. Importamos el Checkbox
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

  // 2. Agregamos el estado para el Checkbox (booleano)
  const [permisoCredito, setPermisoCredito] = useState(false);

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
      permiso_credito: permisoCredito, // 3. Lo incluimos en los datos a enviar
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
            "Hubo un error al editar el cliente por favor verifique bien los datos",
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

    // 4. Inicializamos el estado del Checkbox al abrir el modal.
    // Validamos si viene como booleano (true) o como string ("Activo")
    setPermisoCredito(
      selectProveedor.permiso_credito === true ||
        selectProveedor.permiso_credito === "Activo",
    );
  }, [isOpen, selectProveedor]);

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
              <div className="w-full flex gap-4 items-end">
                <Input
                  className="w-1/2"
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

                {/* 5. Checkbox Reemplazado */}
                <div className="w-1/4 flex items-center h-10">
                  <Checkbox
                    isSelected={permisoCredito}
                    onValueChange={setPermisoCredito}
                    color="primary"
                    size="md"
                  >
                    Permiso Crédito
                  </Checkbox>
                </div>

                <Select
                  className="w-1/4"
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
                    // setDataDni({ nombre_completo: null }); <-- ESTO DABA ERROR PORQUE setDataDni NO EXISTE EN TU CÓDIGO
                    setDataRuc({ nombre_o_razon_social: null, direccion: "" });
                    setPermisoCredito(false);
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
