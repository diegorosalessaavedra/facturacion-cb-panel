import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CamposClienteComprobante from "./components/CamposClienteComprobante";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import CamposMetodosPagoComprobante from "./components/CamposMetodosPagoComprobante";
import CamposProductosComprobante from "./components/CamposProductosComprobante";
import axios from "axios";
import config from "../../../../../utils/getToken";
import { toast } from "sonner";
import Loading from "../../../../../hooks/Loading";

const ModalGenerarComprobante = ({
  userData,
  onOpenChange,
  isOpen,
  selectCotizacion,
  handleFindCotizaciones,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectCliente, setSelectCliente] = useState(
    selectCotizacion.clienteId
  );
  const [arrayPagos, setArrayPagos] = useState([]);
  const [dataSelects, setDataSelects] = useState({
    vendedor: selectCotizacion?.vendedor || "",
  });
  const [tipoOperacion, setTipoOperacion] = useState("VENTA INTERNA");
  const [monto, setMonto] = useState();
  const [porcentaje, setPorcentaje] = useState(10);

  const resetDatos = () => {
    if (!selectCotizacion?.pagos || !selectCotizacion?.productos) return;

    const pagosAcumulados = selectCotizacion.pagos.map((pago) => ({
      id: pago.id,
      metodoPago: pago.metodoPago?.id?.toString() || "",
      banco: pago.banco?.id?.toString() || "",
      operacion: pago.operacion || "",
      monto: pago.monto || 0,
      fecha: pago.fecha || "",
    }));

    setArrayPagos(pagosAcumulados);
  };
  useEffect(() => {
    resetDatos();
  }, [selectCotizacion]);

  const submit = (data) => {
    const total = selectCotizacion?.productos.reduce(
      (acc, producto) => acc + Number(producto.total),
      0
    );

    const newData = {
      ...data,
      clienteId: selectCliente || cotizacion.clienteId,
      usuarioId: userData.id,
      arrayPagos: arrayPagos,
      productos: selectCotizacion.productos,
      vendedor: dataSelects.vendedor,
      tipoOperacion: tipoOperacion,
      porcentaje: porcentaje,
      montoDetraccion: monto,
      monto_pendiente:
        tipoOperacion === "OPERACIÓN SUJETA A DETRACCIÓN"
          ? Number(total - monto).toFixed(2)
          : null,
    };

    setLoading(true);

    const url = `${
      import.meta.env.VITE_URL_API
    }/comprobantes/comprobante-electronico/${selectCotizacion?.id}`;

    axios
      .post(url, newData, config)
      .then(() => {
        toast.success("El comprobante electronico se registro correctamente");
        handleFindCotizaciones();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "hubo un error al registrar el comprobante por favor verifique bien los campos"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      className="max-h-[90vh] "
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="4xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-sm font-semibold text-zinc-600">
              Generar Comprobante de Cotización registrada: COT-4
            </ModalHeader>
            <ModalBody className="overflow-y-auto">
              {loading && <Loading />}
              <form
                action=""
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(submit)}
              >
                <CamposClienteComprobante
                  userData={userData}
                  register={register}
                  errors={errors}
                  setDataSelects={setDataSelects}
                  selectCotizacion={selectCotizacion}
                  setSelectCliente={setSelectCliente}
                  dataSelects={dataSelects}
                  selectCliente={selectCliente}
                  setTipoOperacion={setTipoOperacion}
                  tipoOperacion={tipoOperacion}
                  monto={monto}
                  setMonto={setMonto}
                  porcentaje={porcentaje}
                  setPorcentaje={setPorcentaje}
                />
                <CamposMetodosPagoComprobante
                  register={register}
                  errors={errors}
                  arrayPagos={arrayPagos}
                  setArrayPagos={setArrayPagos}
                />
                <CamposProductosComprobante
                  selectCotizacion={selectCotizacion}
                />
                <div className="w-full items-center justify-center flex gap-4">
                  <Button type="button" color="danger" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" color="primary">
                    Guardar
                  </Button>
                </div>
              </form>
            </ModalBody>

            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalGenerarComprobante;
