import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TablaAgregarProducto from "../../../ventas/creartCotizacion/components/FormCrearCotizacion/components/TablaAgregarProducto";
import { Button, useDisclosure } from "@nextui-org/react";
import ModalNuevoProveedor from "../../../clientesProveedores/tusProveedores/components/ModalNuevoProveedor/ModalNuevoProveedor";
import CampoDatosProveedorOrdenCompra from "./formNuevaOrdenCompra/CampoDatosProveedorOrdenCompra";
import config from "../../../../utils/getToken";
import Loading from "../../../../hooks/Loading";
import CamposMetodosDePago from "../../../ventas/creartCotizacion/components/FormCrearCotizacion/components/CamposMetodosDePago";
import ModalPdfOrdenCompraId from "../../ordenesCompra/components/ModalPdfOrdenCompraId";
import { toast } from "sonner";

const FormNuevaOrdenCompra = ({ userData }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectModal, setSelectModal] = useState("pdf");
  const [selectProveedor, setSelectProveedor] = useState("");
  const [arrayPagos, setArrayPagos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();

  const [dataSelects, setDataSelects] = useState({
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
    if (!productos || productos.length === 0) {
      toast.error("Debes agregar al menos un producto en la cotización.");
      return;
    }

    const newData = {
      ...data,
      productos: productos,
      arrayPagos: arrayPagos,
      proveedorId: selectProveedor,
      usuarioId: userData?.id,
      banco_beneficiario: dataSelects.banco_beneficiario,
      nro_cuenta_bco: dataSelects.nro_cuenta_bco,
    };
    setLoading(true);

    const url = `${import.meta.env.VITE_URL_API}/compras/orden-compra`;

    axios
      .post(url, newData, config)
      .then((res) => {
        reset();
        setArrayPagos([]);
        setProductos([]);
        toast.success("El SOLPED  se registro correctamente");
        setId(res.data.ordenCompra.id);
        setSelectModal("pdf");
        onOpenChange(true);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Hubo un error al registrar la SOLPED");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full pb-6 ">
      {loading && <Loading />}

      <form
        className="w-full flex flex-col gap-4 "
        onSubmit={handleSubmit(submit)}
      >
        <CampoDatosProveedorOrdenCompra
          setSelectModal={setSelectModal}
          register={register}
          setSelectProveedor={setSelectProveedor}
          selectProveedor={selectProveedor}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          proveedores={proveedores}
          setDataSelects={setDataSelects}
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
          setSelectModal={setSelectModal}
          tipo_productos={watch("tipo_productos")}
        />
        <div className="w-full flex items-center justify-end">
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

      {selectModal === "pdf" && id && (
        <ModalPdfOrdenCompraId
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          id={id}
        />
      )}
    </div>
  );
};

export default FormNuevaOrdenCompra;
