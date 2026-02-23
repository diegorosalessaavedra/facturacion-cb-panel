import { useEffect, useState } from "react";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import config from "../../../utils/getToken";
import axios from "axios";
import { API } from "../../../utils/api";
import LoadingSpinner from "../../../components/LoadingSpinner";
import FormularioApertura from "./components/FormularioApertura";
import { motion } from "framer-motion";
import TablaAperturas from "./components/TablaAperturas";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";
import FlitroApertura from "./components/FlitroApertura";

const PlantillaApertura = () => {
  const [loading, setLoading] = useState(false);
  const [aperturas, setAperturas] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [desgloseCaja, setDesgloseCaja] = useState(null);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [dataFiltros, setdataFiltros] = useState({
    nombre: "",
    fecha_inicio: getTodayDate2(),
    fecha_final: getTodayDate(),
    motivo_apertura: "TODOS",
    estado: "TODOS",
  });

  const handleFindAperturas = () => {
    setLoading(true);
    const filtrosLimpios = Object.fromEntries(
      Object.entries(dataFiltros).filter(
        ([_, value]) => value !== "" && value !== "TODOS",
      ),
    );

    const queryParams = new URLSearchParams(filtrosLimpios).toString();
    const url = `${API}/caja-chica/apertura?${queryParams}`;
    axios
      .get(url, config)
      .then((res) => {
        setDesgloseCaja(res.data.desgloseCaja);

        setAperturas(res.data.aperturas);
        setSaldoTotal(res.data.saldoTotal);
      })
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  };

  const handleFindTrabajadores = () => {
    setLoading(true);
    const url = `${API}/caja-chica/trabajador`;
    axios
      .get(url, config)
      .then((res) => setTrabajadores(res.data.trabajadores))
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindAperturas();
    handleFindTrabajadores();
  }, []);

  return (
    <main className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <LoadingSpinner />}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1600px] h-full mx-auto overflow-y-auto overflow-x-hidden bg-white p-4 rounded-xl flex flex-col gap-4 shadow-xl"
      >
        {/* HEADER (flex-none para que no se aplaste) */}
        <header className="flex-none relative w-full min-h-[68px] bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg shadow-md overflow-hidden p-2 flex items-center justify-between">
          <div className="flex items-center gap-6 relative z-10">
            <div className="bg-white p-2 rounded-md shadow-md">
              <img
                className="w-12 h-12 object-contain"
                src="/logo.jpg"
                alt="logo"
              />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold tracking-tight">
                Plantilla de Apertura
              </h1>
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        {/* Usamos flex-1 min-h-0 para decirle: "ocupa el resto y haz scroll interno si es necesario" */}
        <main className="flex-1 min-h-0 flex flex-col">
          {/* Título (flex-none) */}
          <div className="flex-none px-2 pt-2 pb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
            <h2 className="text-md font-semibold text-slate-700">
              Datos de Apertura
            </h2>
          </div>

          {/* CORRECCIÓN IMPORTANTE AQUÍ:
             Antes esto era un div "p-4" bloque. Ahora es un flex-col que ocupa el alto completo (h-full).
          */}
          <div className="flex-1 min-h-0 flex flex-col gap-4 px-2 pb-2">
            {/* Formulario (flex-none) */}
            <div className="flex-none">
              <FormularioApertura
                desgloseCaja={desgloseCaja}
                trabajadores={trabajadores}
                onSuccess={handleFindAperturas}
                saldoTotal={saldoTotal}
              />
            </div>

            <FlitroApertura
              dataFiltros={dataFiltros}
              setdataFiltros={setdataFiltros}
              handleFindAperturas={handleFindAperturas}
            />
            <div className="flex-1 min-h-[500px] border border-slate-200 rounded-xl overflow-hidden relative">
              <TablaAperturas aperturas={aperturas} />
            </div>
          </div>
        </main>
      </motion.div>
    </main>
  );
};

export default PlantillaApertura;
