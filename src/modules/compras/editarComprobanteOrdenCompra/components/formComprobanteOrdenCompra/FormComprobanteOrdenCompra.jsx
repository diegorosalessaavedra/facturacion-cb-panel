import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CamposComprobanteOrdenCompra from "./components/CamposComprobanteOrdenCompra";
import config from "../../../../../utils/getToken";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, useDisclosure } from "@nextui-org/react";
import ModalNuevoProveedor from "../../../../clientesProveedores/tusProveedores/components/ModalNuevoProveedor/ModalNuevoProveedor";
import Loading from "../../../../../hooks/Loading";
import ModalPdfComprobanteOrdenCompra from "./components/ModalPdfComprobanteOrdenCompra";
import { toast } from "sonner";

const FormComprobanteOrdenCompra = ({ ordenCompra, userData, id }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectModal, setSelectModal] = useState("pdf");
  const [proveedores, setProveedores] = useState([]);
  const [selectProveedor, setSelectProveedor] = useState("");
  // const [arrayPagos, setArrayPagos] = useState([]);
  // const [productos, setProductos] = useState([]);
  const [comprobanteOrdenCompraId, setComprobanteOrdenCompraId] =
    useState(null);
  const [dataSelects, setDataSelects] = useState({
    autorizado: "",
    comprador: "",
  });

  const findProveedores = () => {
    const url = `${import.meta.env.VITE_URL_API}/proveedores`;

    axios.get(url, config).then((res) => {
      setProveedores(res.data.proveedores);
    });
  };

  useEffect(() => {
    findProveedores();
  }, []);

  useEffect(() => {
    setSelectProveedor(ordenCompra.proveedorId);
    // const pagosAcumulados = ordenCompra?.pagos.map((pago) => ({
    //   id: Date.now(),
    //   metodoPago: `${pago.metodoPago.id}`,
    //   banco: `${pago.banco.id}`,
    //   operacion: pago.operacion,
    //   monto: pago.monto,
    //   fecha: pago.fecha,
    // }));

    // // Acumular productos
    // const productosAcumulados = ordenCompra?.productos.map((producto) => ({
    //   id: producto.id,
    //   productoId: `${producto.producto.id}`,
    //   descripcion: `${producto.producto.nombre}`,
    //   cantidad: producto.cantidad,
    //   precioUnitario: producto.precioUnitario,
    //   total: producto.total,
    // }));

    // setArrayPagos(pagosAcumulados);
    // setProductos(productosAcumulados);
    setDataSelects({
      moneda: ordenCompra.moneda,
      autorizado: ordenCompra.autorizado,
      comprador: ordenCompra.comprador,
    });
  }, [id, ordenCompra]);

  const submit = (data) => {
    // if (!productos || productos.length === 0) {
    //   toast.error("Debes agregar al menos un producto en la cotización.");
    //   return;
    // }

    const newData = {
      ...data,
      // productos: productos,
      // arrayPagos: arrayPagos,
      proveedorId: selectProveedor,
      autorizado: dataSelects.autorizado,
      comprador: dataSelects.comprador,
      moneda: dataSelects.moneda,
    };

    setLoading(true);

    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/comprobante/orden-compra/${ordenCompra.id}`;

    axios
      .patch(url, newData, config)
      .then((res) => {
        setLoading(false);
        reset();

        toast.success("El comprobante se edito correctamente");
        setComprobanteOrdenCompraId(res.data.comprobanteOrdenCompra.id);
        setSelectModal("pdf");
        setTimeout(() => {
          onOpen();
        }, 500);
      })
      .catch((err) => {
        toast.error(
          err.response.data.error ||
            "Hubo un error al generar el comprobante por favor verifique bien los datos"
        );

        setLoading(false);
      });
  };

  return (
    <div className="w-full pb-6 ">
      {loading && <Loading />}

      <form
        action=""
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(submit)}
      >
        {proveedores.length > 0 && (
          <CamposComprobanteOrdenCompra
            setSelectModal={setSelectModal}
            isOpen={isOpen}
            onOpen={onOpen}
            userData={userData}
            register={register}
            errors={errors}
            ordenCompra={ordenCompra}
            selectProveedor={selectProveedor}
            setSelectProveedor={setSelectProveedor}
            proveedores={proveedores}
            setDataSelects={setDataSelects}
            dataSelects={dataSelects}
          />
        )}

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

      {selectModal === "proveedor" && (
        <ModalNuevoProveedor
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findProveedores={findProveedores}
        />
      )}

      {comprobanteOrdenCompraId && selectModal === "pdf" && (
        <ModalPdfComprobanteOrdenCompra
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          id={comprobanteOrdenCompraId}
        />
      )}
    </div>
  );
};

export default FormComprobanteOrdenCompra;
