import React, { useEffect, useState } from "react";
import GraficoClientes from "./components/GraficoClientes";
import axios from "axios";
import config from "../../utils/getToken";
import GraficoTotal from "./components/GraficoTotal";
import GraficoVentas from "./components/GraficoVentas";
import GraficoComprasVentas from "./components/GraficoComprasVentas";

const Dasbhoard = () => {
  const [compras, setCompras] = useState();
  const [ventas, setVentas] = useState();
  const [cotizaciones, setCotizaciones] = useState();

  useEffect(() => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/comprobante/orden-compra/total`;

    axios.get(url, config).then((res) => {
      setCompras(res.data.results);
    });
  }, []);

  useEffect(() => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/comprobantes/comprobante-electronico/total`;

    axios.get(url, config).then((res) => {
      setVentas(res.data);
    });
  }, []);

  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_API}/ventas/cotizaciones/total`;

    axios.get(url, config).then((res) => {
      setCotizaciones(res.data.results);
    });
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-10 pt-[70px] flex flex-col overflow-auto">
      <div className="w-full  flex  gap-4 py-4 rounded-md  justify-between ">
        <GraficoClientes />
        <GraficoTotal
          cotizaciones={cotizaciones}
          compras={compras}
          ventas={ventas?.totalAnio}
        />
      </div>
      <div
        className="w-full   
     flex  gap-4 bg-white p-4 rounded-lg shadow-lg  shadow-zinc-300 items-center justify-around"
      >
        <GraficoComprasVentas compras={compras} ventas={ventas?.totalAnio} />
        <GraficoVentas ventas={ventas?.results} />
      </div>
    </div>
  );
};

export default Dasbhoard;
