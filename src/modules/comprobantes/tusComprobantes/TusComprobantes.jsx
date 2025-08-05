import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../../utils/getToken";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";
import TablaTusComprobantes from "./components/TablaTusComprobantes";
import ModalPdfNotaComprobante from "./components/ModalPdfNotaCreditoDebito";
import Loading from "../../../hooks/Loading";
import FiltrarComprobantes from "./components/FiltrarComprobantes";
import ModalAnularComprobante from "./components/ModalAnularComprobante";
import ModalPdfComprobanteElectronico from "./components/ModalPdfComprobanteElectronico copy";

const TusComprobantes = ({ userData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectComprobante, setSelectComprobante] = useState();
  const [selectNota, setSelectNota] = useState();
  const [selectModal, setSelectModal] = useState();
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectFiltro, setSelectFiltro] = useState("fechaEmision");
  const [dataFiltro, setDataFiltro] = useState("");
  const [inicioFecha, setInicioFecha] = useState(getTodayDate2());
  const [finalFecha, setFinalFecha] = useState(getTodayDate());

  const handleFindComprobantes = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/comprobantes/comprobante-electronico?tipoFiltro=${selectFiltro}&dataFiltro=${dataFiltro}&fechaInicial=${inicioFecha}&fechaFinal=${finalFecha}`;

    axios
      .get(url, config)
      .then((res) => {
        setComprobantes(res.data.comprobantes);
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
    handleFindComprobantes();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <Loading />}
      <div className="w-full h-full bg-white flex flex-col gap-3 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Status comprobante de venta </h2>
          </div>
          <Link to="/ventas/crear-cotizacion">
            <Button color="primary" variant="solid" startContent={<FaPlus />}>
              Nuevo
            </Button>
          </Link>
        </div>
        <FiltrarComprobantes
          selectFiltro={selectFiltro}
          setSelectFiltro={setSelectFiltro}
          dataFiltro={dataFiltro}
          setDataFiltro={setDataFiltro}
          inicioFecha={inicioFecha}
          setInicioFecha={setInicioFecha}
          finalFecha={finalFecha}
          setFinalFecha={setFinalFecha}
          handleFindComprobantes={handleFindComprobantes}
        />
        <TablaTusComprobantes
          comprobantes={comprobantes}
          loading={loading}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectComprobante={setSelectComprobante}
          setSelectNota={setSelectNota}
        />
      </div>
      {selectModal === "verComprobante" && (
        <ModalPdfComprobanteElectronico
          key={selectComprobante.id}
          userData={userData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idComprobante={selectComprobante.id}
        />
      )}
      {selectModal === "verNota" && (
        <ModalPdfNotaComprobante
          key={selectNota.id}
          userData={userData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idNotaCreditoDebito={selectNota.id}
        />
      )}

      {selectModal === "anular" && (
        <ModalAnularComprobante
          key={selectComprobante.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindComprobantes={handleFindComprobantes}
          comprobante={selectComprobante}
        />
      )}
    </div>
  );
};

export default TusComprobantes;
