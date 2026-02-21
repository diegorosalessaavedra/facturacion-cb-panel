import { useEffect, useState } from "react";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import config from "../../../utils/getToken";
import axios from "axios";
import { API } from "../../../utils/api";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { motion } from "framer-motion";
import FormularioDesembolso from "./components/FormularioDesembolso";
import TablaDesembolsos from "./components/TablaDesembolsos";
import FlitroDesembolso from "./components/FlitroDesembolso";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";

const PlantillaDesembolso = () => {
  const [loading, setLoading] = useState(false);
  const [desembolsos, setDesembolsos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [conceptos, setConceptos] = useState([]);
  const [dataFiltros, setdataFiltros] = useState({
    nombre: "",
    fecha_inicio: getTodayDate2(),
    fecha_final: getTodayDate(),
    motivo: "TODOS",
    estado: "TODOS",
    demora_dias: "",
  });

  const handleFindDsembolsos = () => {
    setLoading(true);

    const filtrosLimpios = Object.fromEntries(
      Object.entries(dataFiltros).filter(
        ([_, value]) => value !== "" && value !== "TODOS",
      ),
    );
    const queryParams = new URLSearchParams(filtrosLimpios).toString();
    const url = `${API}/caja-chica/desembolso?${queryParams}`;
    axios
      .get(url, config)
      .then((res) => {
        setDesembolsos(res.data.desembolsos);
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

  const handleFindConcepto = () => {
    setLoading(true);
    const url = `${API}/caja-chica/conceptos-rendicion`;

    axios
      .get(url, config)
      .then((res) => setConceptos(res.data.conceptoRendiciones))
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleFindDsembolsos();
    handleFindTrabajadores();
    handleFindConcepto();
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
                Plantilla de Desembolso
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 flex flex-col gap-4">
          {/* Título */}
          <div className="flex-none px-2 pt-2 flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
            <h2 className="text-md font-semibold text-slate-700">
              Datos de Desembolso
            </h2>
          </div>

          <div className="flex-none">
            <FormularioDesembolso
              trabajadores={trabajadores}
              onSuccess={handleFindDsembolsos}
              saldoTotal={saldoTotal}
              conceptos={conceptos}
            />
          </div>
          <FlitroDesembolso
            dataFiltros={dataFiltros}
            setdataFiltros={setdataFiltros}
            handleFindDsembolsos={handleFindDsembolsos}
          />

          <div className="flex-1 min-h-[500px] border border-slate-200 rounded-xl overflow-hidden relative">
            <TablaDesembolsos desembolsos={desembolsos} />
          </div>
        </main>
      </motion.div>
    </main>
  );
};

export default PlantillaDesembolso;
