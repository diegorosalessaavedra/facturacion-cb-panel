import { useEffect, useState } from "react";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import config from "../../../utils/getToken";
import axios from "axios";
import { API } from "../../../utils/api";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { motion } from "framer-motion";
import FormularioDesembolso from "./components/FormularioDesembolso";
import TablaDesembolsos from "./components/TablaDesembolsos";

const PlantillaDesembolso = () => {
  const [loading, setLoading] = useState(false);
  const [desembolsos, setDesembolsos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [saldoTotal, setSaldoTotal] = useState(0);

  const handleFindDsembolsos = () => {
    setLoading(true);
    const url = `${API}/caja-chica/desembolso`;
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

  useEffect(() => {
    handleFindDsembolsos();
    handleFindTrabajadores();
  }, []);

  return (
    <main className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <LoadingSpinner />}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1600px] h-full mx-auto bg-white p-4 rounded-xl flex flex-col gap-4 shadow-xl"
      >
        {/* HEADER MODERNO */}
        {/* flex-none evita que el header se aplaste */}
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

        {/* SECCIÓN PRINCIPAL (FORMULARIO + TABLA) */}
        {/* flex-1 min-h-0 es el TRUCO para que el scroll funcione dentro de flex */}
        <main className="flex-1 min-h-0 flex flex-col gap-4">
          {/* Título */}
          <div className="flex-none px-2 pt-2 flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
            <h2 className="text-md font-semibold text-slate-700">
              Datos de Desembolso
            </h2>
          </div>

          {/* Formulario (flex-none para que ocupe lo que necesita) */}
          <div className="flex-none">
            <FormularioDesembolso
              trabajadores={trabajadores}
              onSuccess={handleFindDsembolsos}
              saldoTotal={saldoTotal}
            />
          </div>

          {/* TABLA (flex-1 para ocupar el resto y permitir scroll) */}
          <div className="flex-1 min-h-0 border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-50">
            <TablaDesembolsos desembolsos={desembolsos} />
          </div>
        </main>
      </motion.div>
    </main>
  );
};

export default PlantillaDesembolso;
