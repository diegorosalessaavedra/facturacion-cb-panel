import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../../utils/getToken";
import FiltrarCotizaciones from "./components/FiltrarCotizaciones";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";
import ModalPdfComprobanteElectronico from "./components/ModalPdfComprobanteElectronico";
import TablaComprobantesCotizacion from "./components/TablaComprobantesCotizacion";
import ExcelComprobantesCotizacion from "../../../assets/excelComprobantesCotizacion";
import { PiFileXlsFill } from "react-icons/pi";

const ComprobantesCotizacion = ({ userData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectComprobante, setSelectComprobante] = useState();
  const [selectModal, setSelectModal] = useState();
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectFiltro, setSelectFiltro] = useState("fechaEmision");
  const [dataFiltro, setDataFiltro] = useState("");
  const [inicioFecha, setInicioFecha] = useState(getTodayDate2());
  const [finalFecha, setFinalFecha] = useState(getTodayDate());
  const [exportingExcel, setExportingExcel] = useState(false);

  const handleFindComprobantes = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/comprobantes/comprobante-electronico/cotizaciones?tipoFiltro=${selectFiltro}&dataFiltro=${dataFiltro}&fechaInicial=${inicioFecha}&fechaFinal=${finalFecha}`;

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

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      await ExcelComprobantesCotizacion.exportToExcel(
        comprobantes,
        inicioFecha,
        finalFecha
      );
      ("Excel exportado exitosamente");
    } catch (error) {
      // Aquí puedes agregar una notificación de error
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-3 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Facturas y boletas emitidas</h2>
          </div>
          <div className="flex gap-2">
            <Link to="/ventas/crear-cotizacion">
              <Button
                color="primary"
                variant="solid"
                radius="sm"
                startContent={<FaPlus />}
              >
                Nuevo
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 px-4">
          <FiltrarCotizaciones
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
          <Button
            className=" text-white "
            color="success"
            variant="solid"
            radius="sm"
            startContent={<PiFileXlsFill className=" text-2xl" />}
            onPress={handleExportExcel}
            isLoading={exportingExcel}
            isDisabled={loading || !comprobantes?.length}
          >
            {exportingExcel ? "Exportando..." : "Exportar"}
          </Button>
        </div>
        <TablaComprobantesCotizacion
          comprobantes={comprobantes}
          loading={loading}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectComprobante={setSelectComprobante}
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
    </div>
  );
};

export default ComprobantesCotizacion;
