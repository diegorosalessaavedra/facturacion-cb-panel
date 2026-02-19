import { useEffect, useState } from "react";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import config from "../../../utils/getToken";
import axios from "axios";
import { API } from "../../../utils/api";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { motion } from "framer-motion";
import FiltroHistoricoRendicion from "./components/FiltroHistoricoRendicion";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";
import TablaHistoricoRendicion from "./components/TablaHistoricoRendicion";

const HistoricoRendicion = () => {
  const [loading, setLoading] = useState(false);
  const [trabajadores, setTrabajadores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [dataFiltros, setdataFiltros] = useState({
    trabajador_id: "",
    fecha_inicio: getTodayDate2(),
    fecha_final: getTodayDate(),
    categoria_gasto: "",
  });
  const [rendiciones, setRendiciones] = useState([]);

  const handleFindRendiciones = () => {
    setLoading(true);

    const filtrosLimpios = Object.fromEntries(
      Object.entries(dataFiltros).filter(
        ([_, value]) => value !== "" && value !== "TODOS",
      ),
    );

    const url = `${API}/caja-chica/rendicion`;
    axios
      .get(
        url,
        {
          params: filtrosLimpios,
        },
        config,
      )
      .then((res) => {
        setRendiciones(res.data.rendiciones);
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

  const handleFindCategoria = () => {
    setLoading(true);
    const url = `${API}/caja-chica/categoria-gasto`;

    axios
      .get(url, config)
      .then((res) => setCategorias(res.data.categoriaGastos))
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleFindTrabajadores();
    handleFindCategoria();
  }, []);

  return (
    <main className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <LoadingSpinner />}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1600px] overflow-hidden h-full mx-auto bg-white p-4 rounded-xl flex flex-col gap-4 shadow-xl"
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
                Historico de Rendición Individual
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 flex flex-col">
          <div className="flex-none px-2 pt-2 pb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
            <h2 className="text-md font-semibold text-slate-700">
              Datos de Rendición
            </h2>
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-4 px-2 pb-2">
            <div className="flex-none">
              <FiltroHistoricoRendicion
                trabajadores={trabajadores}
                categorias={categorias}
                dataFiltros={dataFiltros}
                setdataFiltros={setdataFiltros}
                handleFindRendiciones={handleFindRendiciones}
              />
            </div>
            <TablaHistoricoRendicion rendiciones={rendiciones} />
          </div>
        </main>
      </motion.div>
    </main>
  );
};

export default HistoricoRendicion;
