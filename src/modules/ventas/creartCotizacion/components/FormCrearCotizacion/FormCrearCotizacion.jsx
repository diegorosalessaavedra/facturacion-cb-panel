import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TablaAgregarProducto from "./components/TablaAgregarProducto";
import CamposDatosCliente from "./components/CamposDatosCliente";
import CamposMetodosDePago from "./components/CamposMetodosDePago";
import CamposInformacionAdicional from "./components/CamposInformacionAdicional";
import { Button, useDisclosure } from "@nextui-org/react";
import { toast } from "sonner";
import config from "../../../../../utils/getToken";
import Loading from "../../../../../hooks/Loading";
import ModalNuevoCliente from "../../../../clientesProveedores/tusClientes/components/ModalNuevoCliente/ModalNuevoCliente";
import ModalPdfCotizacion from "../../../cotizaciones/components/ModalPdfCotizacion";

const FormCrearCotizacion = ({ userData }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectModal, setSelectModal] = useState();
  const [selectCliente, setSelectCliente] = useState("");
  const [arrayPagos, setArrayPagos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [idCotizacion, setIdCotizacion] = useState(null);

  const submit = (data) => {
    if (!arrayPagos || arrayPagos.length === 0) {
      toast.error("Debes agregar al menos un método de pago en la cotización.");
      return;
    }

    if (!productos || productos.length === 0) {
      toast.error("Debes agregar al menos un producto en la cotización.");
      return;
    }

    if (!selectCliente) {
      toast.error("Debes seleccionar un cliente.");
      return;
    }

    const newData = {
      ...data,
      clienteId: selectCliente,
      usuarioId: userData.id,
      arrayPagos: arrayPagos,
      productos: productos,
    };
    setLoading(true);

    const url = `${import.meta.env.VITE_URL_API}/ventas/cotizaciones`;

    axios
      .post(url, newData, config)
      .then((res) => {
        setIdCotizacion(res.data.cotizacion.id);
        toast.success("La cotizacion se registro correctamente");
        setSelectModal("pdf");
        onOpenChange(true);
        setArrayPagos([]);
        setProductos([]);
        reset();
      })
      .catch((err) => {
        toast.error(
          "hubo un error al registrar la cotizacion por favor verifique bien los campos"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const findClients = () => {
    const url = `${import.meta.env.VITE_URL_API}/clientes`;

    axios.get(url, config).then((res) => setClientes(res.data.clientes));
  };

  return (
    <div className="w-full pb-6 ">
      {loading && <Loading />}
      <form
        className="w-full flex flex-col gap-4 "
        onSubmit={handleSubmit(submit)}
      >
        <CamposDatosCliente
          setSelectModal={setSelectModal}
          register={register}
          errors={errors}
          clientes={clientes}
          findClients={findClients}
          setSelectCliente={setSelectCliente}
          selectCliente={selectCliente}
          userData={userData}
          onOpen={onOpen}
        />
        <CamposMetodosDePago
          register={register}
          errors={errors}
          arrayPagos={arrayPagos}
          setArrayPagos={setArrayPagos}
        />
        <CamposInformacionAdicional register={register} errors={errors} />
        <TablaAgregarProducto
          productos={productos}
          setProductos={setProductos}
        />
        <div className="w-full flex items-center justify-end">
          <Button type="submit" color="primary">
            Guardar
          </Button>
        </div>
      </form>
      {selectModal === "cliente" && (
        <ModalNuevoCliente
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findClients={findClients}
        />
      )}

      {idCotizacion && selectModal === "pdf" && (
        <ModalPdfCotizacion
          key={idCotizacion}
          userData={userData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idCotizacion={idCotizacion}
        />
      )}
    </div>
  );
};

export default FormCrearCotizacion;
