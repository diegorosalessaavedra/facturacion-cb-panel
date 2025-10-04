import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, useDisclosure } from "@nextui-org/react";
import { toast } from "sonner";
import config from "../../../../../utils/getToken";
import Loading from "../../../../../hooks/Loading";
import { Link } from "react-router-dom";
import ModalNuevoProveedor from "../../../../clientesProveedores/tusProveedores/components/ModalNuevoProveedor/ModalNuevoProveedor";
import TablaEditarProducto from "../../../../ventas/editarCotizacion/components/FormEditarCotizacion/components/TablaEditarProducto";
import CamposEditarMetodosDePago from "../../../../ventas/editarCotizacion/components/FormEditarCotizacion/components/CamposEditarMetodosDePago";
import CamposEditarDatosProveedorOrdenCompra from "./components/CamposEditarDatosProveedorOrdenCompra";

const FormEditarOrdenCompra = ({ userData, ordenCompra }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [selectProveedor, setSelectProveedor] = useState("");
  const [arrayPagos, setArrayPagos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [dataSelects, setDataSelects] = useState({
    autorizado: "",
    comprador: "",
    tipoOrdenCompra: "",
    tipo_productos: "",
    banco_beneficiario: "",
    nro_cuenta_bco: "",
  });

  const findProveedores = () => {
    const url = `${import.meta.env.VITE_URL_API}/proveedores`;

    axios.get(url, config).then((res) => setProveedores(res.data.proveedores));
  };
  useEffect(() => {
    findProveedores();
  }, []);

  const submit = (data) => {
    if (productos.length === 0) {
      toast.error("Debes agregar al menos un producto en la cotización.");
      return;
    }

    const newData = {
      ...data,
      productos: productos,
      arrayPagos: arrayPagos,
      proveedorId: selectProveedor,
      usuarioId: userData.id,
      moneda: dataSelects.moneda,
      autorizado: dataSelects.autorizado,
      comprador: dataSelects.comprador,
      tipoOrdenCompra: dataSelects.tipoOrdenCompra,
      formaPago: dataSelects.formaPago,
      tipo_productos: dataSelects.tipo_productos,
      banco_beneficiario: dataSelects.banco_beneficiario,
      nro_cuenta_bco: dataSelects.nro_cuenta_bco,
    };
    setLoading(true);

    const url = `${import.meta.env.VITE_URL_API}/compras/orden-compra/${
      ordenCompra.id
    }`;

    axios
      .patch(url, newData, config)
      .then(() => {
        toast.success("La orden Compra se edito correctamente");
        resetDatos();
      })
      .catch((err) => {
        toast.error(
          "hubo un error al editar la orden Compra por favor verifique bien los campos"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetDatos = () => {
    setSelectProveedor(ordenCompra.proveedorId);
    const pagosAcumulados = ordenCompra?.pagos.map((pago) => ({
      id: Date.now(),
      metodoPago: `${pago.metodoPago.id}`,
      banco: `${pago.banco.id}`,
      operacion: pago.operacion,
      monto: pago.monto,
      fecha: pago.fecha,
    }));

    // Acumular productos

    const productosAcumulados = ordenCompra?.productos.map((producto) => ({
      id: producto.id,
      productoId: `${producto.producto.id}`,
      nombre: producto?.producto.nombre,
      descripcion: `${producto.descripcion_producto}`,
      cantidad: producto.cantidad,
      precioUnitario: producto.precioUnitario,
      total: producto.total,
      stock: producto?.producto.stock,
      centroCostoId: producto.centro_costo_id,
    }));

    setArrayPagos(pagosAcumulados);
    setProductos(productosAcumulados);
    setDataSelects({
      moneda: ordenCompra.moneda,
      autorizado: ordenCompra.autorizado,
      comprador: ordenCompra.comprador,
      tipoOrdenCompra: ordenCompra.tipoOrdenCompra,
      formaPago: ordenCompra.formaPago,
      tipo_productos: ordenCompra.tipo_productos,
      banco_beneficiario: ordenCompra.banco_beneficiario,
      nro_cuenta_bco: ordenCompra.nro_cuenta_bco,
    });
  };

  useEffect(() => {
    resetDatos();
  }, [ordenCompra]);

  return (
    <div className="w-full pb-6 ">
      {loading && <Loading />}

      <form
        className="w-full flex flex-col gap-4 "
        onSubmit={handleSubmit(submit)}
      >
        <CamposEditarDatosProveedorOrdenCompra
          register={register}
          errors={errors}
          setSelectProveedor={setSelectProveedor}
          selectProveedor={selectProveedor}
          onOpen={onOpen}
          proveedores={proveedores}
          ordenCompra={ordenCompra}
          dataSelects={dataSelects}
          setDataSelects={setDataSelects}
        />
        <CamposEditarMetodosDePago
          register={register}
          errors={errors}
          arrayPagos={arrayPagos}
          setArrayPagos={setArrayPagos}
        />

        <TablaEditarProducto
          productos={productos}
          setProductos={setProductos}
          tipo_productos={dataSelects.tipo_productos}
        />
        <div className="w-full flex gap-4 items-center justify-end">
          <Link to="/compras/ordenes-compra">
            <Button type="button" color="danger">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" color="primary">
            Guardar
          </Button>
        </div>
      </form>

      <ModalNuevoProveedor
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        findProveedores={findProveedores}
      />
    </div>
  );
};

export default FormEditarOrdenCompra;
