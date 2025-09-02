import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaWpforms } from "react-icons/fa";
import axios from "axios";
import config from "../../../utils/getToken";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";
import { PiFileXlsFill } from "react-icons/pi";
import FiltrarReporteOrdenesCompra from "./components/FiltrarReporteOrdenesCompra";
import TablaReporteOrdenesCompra from "./components/TablaReporteOrdenesCompra";
import ExcelReporteOrdenCompra from "../../../assets/exelOrdenCompra";
import ExcelSimplificadoOrdenesCompra from "../../../assets/exelSimplificadoOrdenCompra";
import ModalCambiarValidacion from "./components/ModalCambiarValidacion";

const ReportesOrdenesCompra = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectOrdenCompra, setSelectOrdenCompra] = useState();
  const [loading, setLoading] = useState(true);
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(getTodayDate2());
  const [fechaFinal, setFechaFinal] = useState(getTodayDate());
  const [estadoPago, setEstadoPago] = useState("TODOS");

  const handleFindoOrdenesCompra = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/orden-compra?tipoFiltro=fechaEmision&fechaInicial=${fechaInicio}&fechaFinal=${fechaFinal}&estadoPago=${estadoPago}`;

    axios
      .get(url, config)
      .then((res) => {
        setOrdenesCompra(res.data.ordenesCompras);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindoOrdenesCompra();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Reporte SOLPED</h2>
          </div>
          <div className="flex gap-2">
            <Button
              className="text-white"
              color="success"
              variant="solid"
              startContent={<PiFileXlsFill className="text-xl" />}
              radius="sm"
              onPress={() =>
                ExcelReporteOrdenCompra.exportToExcel(
                  ordenesCompra,
                  fechaInicio,
                  fechaFinal
                )
              }
            >
              Descargar
            </Button>
            <Button
              className="text-white"
              color="success"
              variant="solid"
              startContent={<PiFileXlsFill className="text-xl" />}
              radius="sm"
              onPress={() =>
                ExcelSimplificadoOrdenesCompra.exportToExcel(
                  ordenesCompra,
                  fechaInicio,
                  fechaFinal
                )
              }
            >
              Descargar Simple
            </Button>
          </div>
        </div>
        <FiltrarReporteOrdenesCompra
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFinal={fechaFinal}
          setFechaFinal={setFechaFinal}
          handleFindoOrdenesCompra={handleFindoOrdenesCompra}
          setEstadoPago={setEstadoPago}
          estadoPago={estadoPago}
        />
        <TablaReporteOrdenesCompra
          ordenesCompra={ordenesCompra}
          loading={loading}
          setSelectOrdenCompra={setSelectOrdenCompra}
          onOpen={onOpen}
        />
      </div>
      <ModalCambiarValidacion
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleFindoOrdenesCompra={handleFindoOrdenesCompra}
        selectOrdenCompra={selectOrdenCompra}
      />
    </div>
  );
};

export default ReportesOrdenesCompra;
