import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Divider, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import config from "../../../utils/getToken";
import { toast } from "sonner";
import CamposClienteComprobanteElectronico from "./components/CamposClienteComprobanteElectronico";
import TablaAgregarProducto from "../../ventas/creartCotizacion/components/FormCrearCotizacion/components/TablaAgregarProducto";
import Loading from "../../../hooks/Loading";
import CamposMetodosDePago from "../../ventas/creartCotizacion/components/FormCrearCotizacion/components/CamposMetodosDePago";
import ModalNuevoCliente from "../../clientesProveedores/tusClientes/components/ModalNuevoCliente/ModalNuevoCliente";
import ModalPdfComprobanteElectronico from "../tusComprobantes/components/ModalPdfComprobanteElectronico copy";

const ComprobanteElectronico = ({ userData }) => {
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
  const [idComprobante, setIdComprobante] = useState(null);
  const [dataSelects, setDataSelects] = useState({
    vendedor: "",
    tipoOperacion: "VENTA INTERNA",
    tipoComprobante: "NOTA DE VENTA",
  });

  const [monto, setMonto] = useState();
  const [porcentaje, setPorcentaje] = useState(10);

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

    const total = productos?.reduce(
      (acc, producto) => acc + Number(producto.total),
      0
    );

    const newData = {
      ...data,
      tipoComprobante: dataSelects.tipoComprobante,
      clienteId: selectCliente,
      usuarioId: userData?.id,
      arrayPagos: arrayPagos,
      productos: productos,
      vendedor: dataSelects.vendedor,
      tipoOperacion: dataSelects.tipoOperacion,
      porcentaje: porcentaje,
      montoDetraccion: monto,
      monto_pendiente:
        dataSelects.tipoOperacion === "OPERACIÓN SUJETA A DETRACCIÓN"
          ? Number(total - monto).toFixed(2)
          : null,
    };

    setLoading(true);

    const url = `${
      import.meta.env.VITE_URL_API
    }/comprobantes/comprobante-electronico`;

    axios
      .post(url, newData, config)
      .then((res) => {
        setIdComprobante(res.data.comprobanteElectronico.id);
        toast.success("El comprobante electronico se registro correctamente");
        setSelectModal("pdf");
        onOpenChange(true);
        setArrayPagos([]);
        setProductos([]);
        reset();
      })
      .catch((err) => {
        toast.error(
          "hubo un error al registrar el comprobante por favor verifique bien los campos"
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
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      {loading && <Loading />}
      <div className="w-full h-full bg-white flex flex-col gap-4 px-6 rounded-md overflow-auto">
        <div className="w-full flex px-10 py-6 gap-10 items-center">
          <img className="w-32 h-28" src={import.meta.env.VITE_LOGO} alt="" />
          <div className="flex flex-col ">
            <h1 className="text-sm font-bold">
              Emitir comprobantes de venta sin cotización
            </h1>
            <h2 className="text-sm font-bold">{import.meta.env.VITE_NOMBRE}</h2>
            <ul>
              <li className="text-stone-400 text-xs font-medium">
                {import.meta.env.VITE_DIRRECION}{" "}
              </li>
              <li className="text-stone-400 text-xs font-medium">
                {import.meta.env.VITE_CORREO} - {import.meta.env.VITE_TELEFONO}
              </li>
            </ul>
          </div>
        </div>
        <Divider className="bg-neutral-200 h-[2px] mt-[-15px]" />

        <div className="w-full  bg-white flex flex-col gap-4 p-6 rounded-md ">
          <form
            action=""
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(submit)}
          >
            <CamposClienteComprobanteElectronico
              setSelectModal={setSelectModal}
              register={register}
              errors={errors}
              clientes={clientes}
              findClients={findClients}
              setSelectCliente={setSelectCliente}
              selectCliente={selectCliente}
              userData={userData}
              onOpen={onOpen}
              setDataSelects={setDataSelects}
              dataSelects={dataSelects}
              productos={productos}
              monto={monto}
              setMonto={setMonto}
              porcentaje={porcentaje}
              setPorcentaje={setPorcentaje}
            />
            <CamposMetodosDePago
              register={register}
              errors={errors}
              arrayPagos={arrayPagos}
              setArrayPagos={setArrayPagos}
            />
            <TablaAgregarProducto
              productos={productos}
              setProductos={setProductos}
              tipoOperacion={dataSelects.tipoOperacion}
              monto={monto}
              isMerma={dataSelects.tipoComprobante === "MERMA"}
            />
            <div className="w-full items-center justify-center flex gap-4">
              <Button type="submit" color="primary">
                Guardar
              </Button>
            </div>
          </form>
        </div>
      </div>

      {selectModal === "cliente" && (
        <ModalNuevoCliente
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findClients={findClients}
        />
      )}

      {selectModal === "pdf" && (
        <ModalPdfComprobanteElectronico
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idComprobante={idComprobante}
        />
      )}
    </div>
  );
};

export default ComprobanteElectronico;
