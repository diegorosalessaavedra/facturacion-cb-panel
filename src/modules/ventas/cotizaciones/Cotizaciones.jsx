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
import ModalAnularCotizacion from "./components/ModalAnularCotizacion";
import Loading from "../../../hooks/Loading";
import ModalPdfComprobanteElectronico from "../comprobantesCotizacion/components/ModalPdfComprobanteElectronico";

const Cotizaciones = ({ userData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectCotizacion, setSelectCotizacion] = useState();
  const [selectModal, setSelectModal] = useState();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // ESTADO UNIFICADO PARA LOS FILTROS
  const [filtros, setFiltros] = useState({
    tipoFiltro: "fechaEmision",
    dataFiltro: "",
    estadoCotizacion: "todos",
    inicioFecha: getTodayDate2(),
    finalFecha: getTodayDate(),
  });

  // Función manejadora centralizada
  const handleChangeFiltro = (campo, valor) => {
    setFiltros((prev) => {
      const nuevosFiltros = { ...prev, [campo]: valor };

      // Lógica de reseteo automático al cambiar el tipo de filtro
      if (campo === "tipoFiltro") {
        const esFecha = valor === "fechaEmision" || valor === "fechaEntrega";
        nuevosFiltros.finalFecha = esFecha ? getTodayDate() : "";
        nuevosFiltros.inicioFecha = esFecha ? getTodayDate2() : "";
        nuevosFiltros.dataFiltro = esFecha ? "" : nuevosFiltros.dataFiltro;
      }

      return nuevosFiltros;
    });
  };

  const handleFindCotizaciones = () => {
    setLoading(true);

    const parametrosApi = {
      tipoFiltro: filtros.tipoFiltro,
      dataFiltro: filtros.dataFiltro,
      fechaInicial: filtros.inicioFecha,
      fechaFinal: filtros.finalFecha,
      estado: filtros.estadoCotizacion,
    };

    const filtrosLimpios = Object.fromEntries(
      Object.entries(parametrosApi).filter(
        ([_, value]) => value !== "" && value !== "TODOS" && value !== "todos",
      ),
    );

    const queryParams = new URLSearchParams(filtrosLimpios).toString();

    const url = `${import.meta.env.VITE_URL_API}/ventas/cotizaciones?${queryParams}`;
    axios
      .get(url, config)
      .then((res) => {
        setCotizaciones(res.data.cotizaciones);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindCotizaciones();
  }, []); // Se ejecuta solo al montar

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

        {/* Pasamos solo 3 props en lugar de 11 */}
        <div className="w-full px-6">
          <FiltrarCotizaciones
            filtros={filtros}
            handleChangeFiltro={handleChangeFiltro}
            handleFindCotizaciones={handleFindCotizaciones}
          />
        </div>

        <TablaCotizaciones
          cotizaciones={cotizaciones}
          loading={loading}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectCotizacion={setSelectCotizacion}
          userData={userData}
        />
      </div>

      {/* ... (Tus modales quedan exactamente igual) ... */}
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
