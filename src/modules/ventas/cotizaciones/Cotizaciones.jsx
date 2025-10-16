import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import { Link } from "react-router-dom";
import TablaCotizaciones from "./components/TablaCotizaciones";
import axios from "axios";
import config from "../../../utils/getToken";
import ModalGenerarComprobante from "./components/modalGenerarComprobante/ModalGenerarComprobante";
import ModalPdfCotizacion from "./components/ModalPdfCotizacion";
import FiltrarCotizaciones from "./components/FiltrarCotizaciones";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";
import ModalPdfComprobanteElectronico from "./components/ModalPdfComprobanteElectronico";
import ModalAnularCotizacion from "./components/ModalAnularCotizacion";
import Loading from "../../../hooks/Loading";

const Cotizaciones = ({ userData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectCotizacion, setSelectCotizacion] = useState();
  const [selectModal, setSelectModal] = useState();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectFiltro, setSelectFiltro] = useState("fechaEmision");
  const [dataFiltro, setDataFiltro] = useState("");
  const [estadoCotizacion, setEstadoCotizacion] = useState("todos");
  const [inicioFecha, setInicioFecha] = useState(getTodayDate2());
  const [finalFecha, setFinalFecha] = useState(getTodayDate());

  const handleFindCotizaciones = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/ventas/cotizaciones?tipoFiltro=${selectFiltro}&dataFiltro=${dataFiltro}&fechaInicial=${inicioFecha}&fechaFinal=${finalFecha}&estado=${estadoCotizacion}`;

    axios
      .get(url, config)
      .then((res) => {
        setCotizaciones(res.data.cotizaciones);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    selectFiltro === "fechaEmision" || selectFiltro === "fechaEntrega"
      ? setFinalFecha(getTodayDate())
      : setDataFiltro("");
    selectFiltro === "fechaEmision" || selectFiltro === "fechaEntrega"
      ? setInicioFecha(getTodayDate2())
      : setInicioFecha("");
  }, [selectFiltro]);

  useEffect(() => {
    handleFindCotizaciones();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <Loading />}

      <div className="w-full h-full bg-white flex flex-col gap-3 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Cotizaciones</h2>
          </div>
          <Link to="/ventas/crear-cotizacion">
            <Button color="primary" variant="solid" startContent={<FaPlus />}>
              Nuevo
            </Button>
          </Link>
        </div>
        <FiltrarCotizaciones
          selectFiltro={selectFiltro}
          setSelectFiltro={setSelectFiltro}
          dataFiltro={dataFiltro}
          setDataFiltro={setDataFiltro}
          inicioFecha={inicioFecha}
          setInicioFecha={setInicioFecha}
          finalFecha={finalFecha}
          setFinalFecha={setFinalFecha}
          setEstadoCotizacion={setEstadoCotizacion}
          estadoCotizacion={estadoCotizacion}
          handleFindCotizaciones={handleFindCotizaciones}
        />
        <TablaCotizaciones
          cotizaciones={cotizaciones}
          loading={loading}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectCotizacion={setSelectCotizacion}
          userData={userData}
        />
      </div>
      {selectModal === "comprobante" && (
        <ModalGenerarComprobante
          key={selectCotizacion.id}
          userData={userData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectCotizacion={selectCotizacion}
          handleFindCotizaciones={handleFindCotizaciones}
        />
      )}
      {selectModal === "verComprobante" && (
        <ModalPdfComprobanteElectronico
          key={selectCotizacion.id}
          userData={userData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idComprobante={selectCotizacion.comprobanteElectronicoId}
        />
      )}

      {selectModal === "pdf" && (
        <ModalPdfCotizacion
          key={selectCotizacion.id}
          userData={userData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idCotizacion={selectCotizacion.id}
        />
      )}
      {selectModal === "anular" && (
        <ModalAnularCotizacion
          key={selectCotizacion.id}
          userData={userData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectCotizacion={selectCotizacion}
          handleFindCotizaciones={handleFindCotizaciones}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default Cotizaciones;
