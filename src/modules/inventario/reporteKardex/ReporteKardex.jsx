import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../utils/getToken";
import TablaReporteKardex from "./components/TablaReporteKardex";
import FiltroReporteKardex from "./components/FiltroReporteKardex";
import Loading from "../../../hooks/Loading";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";

const ReporteKardex = () => {
  const [productos, setProductos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(getTodayDate2());
  const [fechaFinal, setFechaFinal] = useState(getTodayDate());

  const [loading, setLoading] = useState(false);

  const handleFindProductos = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/productos/mis-productos/kardex?startDate=${fechaInicio}&endDate=${fechaFinal}`;

    axios
      .get(url, config)
      .then((res) => {
        setProductos(res.data.misProductos);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleFindProductos();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <Loading />}

      <div className="w-full h-full bg-white flex flex-col gap-4 rounded-md  overflow-y-auto overflow-x-hidden">
        <div className="w-full px-6 py-3 bg-blue-600 flex items-center     justify-between">
          <h2 className=" text-white font-normal text-lg">Consulta kardex</h2>
        </div>
        <FiltroReporteKardex
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFinal={fechaFinal}
          setFechaFinal={setFechaFinal}
          productos={productos}
          handleFindProductos={handleFindProductos}
        />
        <TablaReporteKardex productos={productos} />
      </div>
    </div>
  );
};

export default ReporteKardex;
