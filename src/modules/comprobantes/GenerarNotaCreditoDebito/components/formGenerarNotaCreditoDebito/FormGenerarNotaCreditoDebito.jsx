import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import ModalNuevoCliente from "../../../../clientesProveedores/tusClientes/components/ModalNuevoCliente/ModalNuevoCliente";
import CamposClienteNota from "./components/CamposClienteNota";
import config from "../../../../../utils/getToken";
import TablaAgregarProducto from "../../../../ventas/creartCotizacion/components/FormCrearCotizacion/components/TablaAgregarProducto";
import Loading from "../../../../../hooks/Loading";
import ModalPdfNotaComprobante from "../../../tusComprobantes/components/ModalPdfNotaCreditoDebito";

const FormGenerarNotaCreditoDebito = ({ userData, comprobanteElectronico }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectModal, setSelectModal] = useState();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idNotaComprobante, setIdNotaComprobante] = useState(null);
  const [dataSelects, setDataSelects] = useState({
    tipo_comprobante: "NOTA DE CREDITO",
  });

  const submit = (data) => {
    if (!productos || productos.length === 0) {
      toast.error(
        "Debes agregar al menos un producto en la  nota de credito o devito."
      );
      return;
    }

    const newData = {
      ...data,
      usuarioId: userData.id,
      productos: productos,
      dataSelects: dataSelects,
      tipo_nota: dataSelects.tipo_comprobante,
      motivo: dataSelects.motivo.descripcion,
      codigo_motivo: dataSelects.motivo.codigo,
    };

    setLoading(true);

    const url = `${
      import.meta.env.VITE_URL_API
    }/comprobantes/notas-comprobantes/${comprobanteElectronico.id}`;

    axios
      .post(url, newData, config)
      .then((res) => {
        setIdNotaComprobante(res.data.notaComprobante.id);
        toast.success(
          `La nota de ${dataSelects.tipo_comprobante} se registro correctamente`
        );
        setSelectModal("verNota");
        onOpenChange(true);
        setProductos([]);
        reset();
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.error ||
            `hubo un error al registrar la nota de ${dataSelects.tipo_comprobante} por favor verifique bien los campos`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetDatos = () => {
    const productosAcumulados = comprobanteElectronico?.productos.map(
      (producto) => ({
        id: producto.id,
        productoId: producto.producto?.id?.toString() || "",
        descripcion: producto.producto?.nombre || "",
        cantidad: producto.cantidad || 0,
        precioUnitario: producto.precioUnitario || 0,
        total: producto.total || 0,
      })
    );

    setProductos(productosAcumulados);
  };

  useEffect(() => {
    resetDatos();
  }, [comprobanteElectronico]);

  return (
    <div className="w-full  bg-white flex flex-col gap-4 p-6 rounded-md ">
      {!comprobanteElectronico && <Loading />}
      {loading && <Loading />}

      <form
        action=""
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(submit)}
      >
        <CamposClienteNota
          setSelectModal={setSelectModal}
          register={register}
          errors={errors}
          userData={userData}
          onOpen={onOpen}
          setDataSelects={setDataSelects}
          dataSelects={dataSelects}
          comprobanteElectronico={comprobanteElectronico}
        />

        <TablaAgregarProducto
          productos={productos}
          setProductos={setProductos}
          setSelectModal={setSelectModal}
        />
        <div className="w-full items-center justify-center flex gap-4">
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

      {selectModal === "verNota" && (
        <ModalPdfNotaComprobante
          key={idNotaComprobante}
          userData={userData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idNotaCreditoDebito={idNotaComprobante}
        />
      )}
    </div>
  );
};

export default FormGenerarNotaCreditoDebito;
