import { useEffect, useState } from "react";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import config from "../../../utils/getToken";
import axios from "axios";
import { API } from "../../../utils/api";
import LoadingSpinner from "../../../components/LoadingSpinner";
import FormularioApertura from "./components/FormularioDesembolso";
import { motion } from "framer-motion";
import TablaAperturas from "./components/TablaDesembolsos";
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

  console.log(desembolsos);

  return (
    <main className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <LoadingSpinner />}

      {/* Contenedor Principal con animación de entrada */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1600px] h-full  mx-auto bg-white  p-4  rounded-xl flex flex-col "
      >
        {/* HEADER MODERNO */}
        <header className="relative w-full bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg shadow-xl overflow-hidden p-2 flex items-center justify-between">
          {/* Elemento decorativo de fondo */}

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

        {/* SECCIÓN DEL FORMULARIO Y TABLA */}
        <main className="bg-white overflow-hidden min-h-[600px]">
          {/* Título de sección opcional */}
          <div className="px-2 pt-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
            <h2 className="text-md font-semibold text-slate-700">
              Datos de Desembolso
            </h2>
          </div>

          <div className="p-4 ">
            <FormularioDesembolso
              trabajadores={trabajadores}
              onSuccess={handleFindDsembolsos}
              saldoTotal={saldoTotal}
            />

            {/* AQUÍ IRÍA TU TABLA EXISTENTE */}
            <div className="mt-4 border rounded-xl overflow-hidden">
              <TablaDesembolsos desembolsos={desembolsos} />
            </div>
          </div>
        </main>
      </motion.div>
    </main>
  );
};

export default PlantillaDesembolso;
