import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaWpforms } from "react-icons/fa";
import axios from "axios";
import config from "../../../utils/getToken";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";
import TablaReporteCotizaciones from "./components/TablaReporteCotizaciones";
import FiltrarReporteCotizaciones from "./components/FiltrarReporteCotizaciones";
import { PiFileXlsFill } from "react-icons/pi";
import formatDate from "../../../hooks/FormatDate";
import ExcelReporteCotizacion from "../../../assets/exelCotizaciones";

const ReportesCotizaciones = () => {
  const [loading, setLoading] = useState(true);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(getTodayDate2());
  const [fechaFinal, setFechaFinal] = useState(getTodayDate());

  const handleFindCotizaciones = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/ventas/cotizaciones?tipoFiltro=fechaEmision&fechaInicial=${fechaInicio}&fechaFinal=${fechaFinal}&estado=todos`;

    axios
      .get(url, config)
      .then((res) => {
        setCotizaciones(res.data.cotizaciones);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindCotizaciones(cotizaciones);
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Reporte de Cotizaciones</h2>
          </div>
          <Button
            className="text-white"
            color="success"
            variant="solid"
            startContent={<PiFileXlsFill className="text-xl" />}
            radius="sm"
            onClick={() =>
              ExcelReporteCotizacion.exportToExcel(
                cotizaciones,
                fechaInicio,
                fechaFinal,
                formatDate
              )
            }
          >
            Descargar
          </Button>
        </div>
        <FiltrarReporteCotizaciones
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFinal={fechaFinal}
          setFechaFinal={setFechaFinal}
          handleFindCotizaciones={handleFindCotizaciones}
        />
        <TablaReporteCotizaciones
          cotizaciones={cotizaciones}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ReportesCotizaciones;
