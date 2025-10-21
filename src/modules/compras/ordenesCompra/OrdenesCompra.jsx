import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../../utils/getToken";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";
import TablaOrdenCompras from "./components/TablaOrdenCompras";
import ModalPdfOrdenCompraId from "./components/ModalPdfOrdenCompraId";
import ModalPdfComprobanteOrdenCompra from "../comprobanteOrdenCompra/components/formComprobanteOrdenCompra/components/ModalPdfComprobanteOrdenCompra";
import FiltrarOrdenesCompra from "./FiltrarOrdenesCompra";
import ModalAnularComprobanteOrdenCompra from "./components/ModalAnularComprobanteOrdenCompra";
import Loading from "../../../hooks/Loading";
import EditarComprobanteOrdenCompra from "../editarComprobanteOrdenCompra/EditarComprobanteOrdenCompra";
import ModalAdjuntarSolped from "./components/ModalAdjuntarSolped";
import ModalCambiarValidacion from "./components/ModalCambiarValidacion";
import DescargarLayout from "../../../hooks/DescargarTxt";

const OrdenesCompra = ({ userData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectOrdenCompra, setSelectOrdenCompra] = useState();
  const [selectModal, setSelectModal] = useState();
  const [ordenCompras, setOrdenCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectFiltro, setSelectFiltro] = useState("fechaEmision");
  const [dataFiltro, setDataFiltro] = useState("");
  const [inicioFecha, setInicioFecha] = useState(getTodayDate2());
  const [finalFecha, setFinalFecha] = useState(getTodayDate());
  const [txtSolpeds, setTxtSolpeds] = useState([]);
  const [estadoPago, setEstadoPago] = useState("TODOS");

  const handleFindOrdenCompras = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/orden-compra?tipoFiltro=${selectFiltro}&dataFiltro=${dataFiltro}&fechaInicial=${inicioFecha}&fechaFinal=${finalFecha}&estadoPago=${estadoPago}`;

    axios
      .get(url, config)
      .then((res) => {
        setOrdenCompras(res.data.ordenesCompras);
        setTxtSolpeds(
          res.data.ordenesCompras.filter((o) => o.validacion === true)
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    selectFiltro === "fechaEmision" || selectFiltro === "fechaEntrega"
      ? setDataFiltro(getTodayDate())
      : setDataFiltro("");
  }, [selectFiltro]);

  useEffect(() => {
    handleFindOrdenCompras();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <Loading />}
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Status SOLPED</h2>
          </div>
          <div className="flex gap-2">
            <Link to="/compras/nueva-orden-compra">
              <Button color="primary" variant="solid" startContent={<FaPlus />}>
                Nuevo
              </Button>
            </Link>
            <DescargarLayout
              txtSolpeds={txtSolpeds}
              handleFindOrdenCompras={handleFindOrdenCompras}
            />
          </div>
        </div>
        <FiltrarOrdenesCompra
          selectFiltro={selectFiltro}
          setSelectFiltro={setSelectFiltro}
          dataFiltro={dataFiltro}
          setDataFiltro={setDataFiltro}
          inicioFecha={inicioFecha}
          setInicioFecha={setInicioFecha}
          finalFecha={finalFecha}
          setFinalFecha={setFinalFecha}
          handleFindOrdenCompras={handleFindOrdenCompras}
          setEstadoPago={setEstadoPago}
          estadoPago={estadoPago}
          txtSolpeds={txtSolpeds}
        />
        <TablaOrdenCompras
          ordenCompras={ordenCompras}
          loading={loading}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectOrdenCompra={setSelectOrdenCompra}
          userData={userData}
        />
      </div>
      {selectOrdenCompra?.id && selectModal === "pdf" && (
        <ModalPdfOrdenCompraId
          key={selectOrdenCompra.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          id={selectOrdenCompra?.id}
        />
      )}

      {selectModal === "verComprobante" && (
        <ModalPdfComprobanteOrdenCompra
          key={selectOrdenCompra.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          id={selectOrdenCompra?.comprobanteOrdenCompraId}
        />
      )}

      {selectModal === "anular" && (
        <ModalAnularComprobanteOrdenCompra
          key={selectOrdenCompra.id}
          isOpen={isOpen}
          setLoading={setLoading}
          onOpenChange={onOpenChange}
          selectOrdenCompra={selectOrdenCompra}
          handleFindOrdenCompras={handleFindOrdenCompras}
        />
      )}
      {selectModal === "editarComprobante" && (
        <EditarComprobanteOrdenCompra
          key={selectOrdenCompra.comprobanteOrdenCompraId}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          id={selectOrdenCompra.comprobanteOrdenCompraId}
        />
      )}
      {selectModal === "adjuntar_solped" && (
        <ModalAdjuntarSolped
          key={selectOrdenCompra.id}
          isOpen={isOpen}
          setLoading={setLoading}
          onOpenChange={onOpenChange}
          selectOrdenCompra={selectOrdenCompra}
          handleFindOrdenCompras={handleFindOrdenCompras}
        />
      )}

      {selectModal === "cambiar_validacion" && (
        <ModalCambiarValidacion
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindOrdenCompras={handleFindOrdenCompras}
          selectOrdenCompra={selectOrdenCompra}
          setTxtSolpeds={setTxtSolpeds}
        />
      )}
    </div>
  );
};

export default OrdenesCompra;
