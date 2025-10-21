import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CamposDatosCliente from "./components/CamposEditarDatosCliente";
import { Button, useDisclosure } from "@nextui-org/react";
import { toast } from "sonner";
import config from "../../../../../utils/getToken";
import CamposEditarMetodosDePago from "./components/CamposEditarMetodosDePago";
import EditarCamposInformacionAdicional from "./components/EditarCamposInformacionAdicional";
import TablaEditarProducto from "./components/TablaEditarProducto";
import Loading from "../../../../../hooks/Loading";
import { Link } from "react-router-dom";
import ModalNuevoCliente from "../../../../clientesProveedores/tusClientes/components/ModalNuevoCliente/ModalNuevoCliente";

const FormEditarCotizacion = ({ userData, cotizacion }) => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectCliente, setSelectCliente] = useState("");
  const [arrayPagos, setArrayPagos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [dataSelects, setDataSelects] = useState({
    tipoEnvio: cotizacion?.tipoEnvio || "",
    vendedor: cotizacion?.vendedor || "",
    tipoCotizacion: cotizacion.tipoCotizacion,
  });

  const submit = (data) => {
    if (arrayPagos.length === 0) {
      toast.error("Debes agregar al menos un método de pago en la cotización.");
      return;
    }

    if (productos.length === 0) {
      toast.error("Debes agregar al menos un producto en la cotización.");
      return;
    }

    const newData = {
      ...data,
      clienteId: selectCliente || cotizacion.clienteId,
      usuarioId: userData?.id,
      arrayPagos: arrayPagos,
      productos: productos,
      tipoEnvio: dataSelects.tipoEnvio,
      vendedor: dataSelects.vendedor,
      tipoCotizacion: dataSelects.tipoCotizacion,
    };
    setLoading(true);

    const url = `${import.meta.env.VITE_URL_API}/ventas/cotizaciones/${
      cotizacion.id
    }`;

    axios
      .patch(url, newData, config)
      .then((res) => {
        toast.success("La cotizacion se registro correctamente");
        resetDatos();
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

  const resetDatos = () => {
    if (!cotizacion?.pagos || !cotizacion?.productos) return;

    const pagosAcumulados = cotizacion.pagos.map((pago) => ({
      id: pago.id,
      metodoPago: pago.metodoPago?.id?.toString() || "",
      banco: pago.banco?.id?.toString() || "",
      operacion: pago.operacion || "",
      monto: pago.monto || 0,
      fecha: pago.fecha || "",
    }));

    const productosAcumulados = cotizacion.productos.map((producto) => ({
      id: producto.id,
      productoId: producto.producto?.id?.toString() || "",
      nombre: producto.producto?.nombre || "",
      cantidad: producto.cantidad || 0,
      precioUnitario: producto.precioUnitario || 0,
      total: producto.total || 0,
      descripcion: "",
      stock: producto.producto?.stock || 0,
    }));

    setArrayPagos(pagosAcumulados);
    setProductos(productosAcumulados);
  };

  useEffect(() => {
    resetDatos();
  }, [cotizacion]);

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
          register={register}
          errors={errors}
          clientes={clientes}
          findClients={findClients}
          setSelectCliente={setSelectCliente}
          selectCliente={selectCliente}
          userData={userData}
          cotizacion={cotizacion}
          onOpen={onOpen}
          dataSelects={dataSelects}
          setDataSelects={setDataSelects}
        />
        <CamposEditarMetodosDePago
          register={register}
          errors={errors}
          arrayPagos={arrayPagos}
          setArrayPagos={setArrayPagos}
        />
        <EditarCamposInformacionAdicional
          register={register}
          errors={errors}
          cotizacion={cotizacion}
        />
        <TablaEditarProducto
          productos={productos}
          setProductos={setProductos}
        />
        <div className="w-full flex gap-4 items-center justify-end">
          <Link to="/ventas/cotizaciones">
            <Button type="button" color="danger">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" color="primary">
            Guardar
          </Button>
        </div>
      </form>

      <ModalNuevoCliente
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        findClients={findClients}
      />
    </div>
  );
};

export default FormEditarCotizacion;
