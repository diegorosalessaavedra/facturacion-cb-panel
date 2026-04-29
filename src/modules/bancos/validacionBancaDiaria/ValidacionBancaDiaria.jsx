import axios from "axios";
import config from "../../../utils/getToken";
import { useEffect, useState, useCallback } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { motion } from "framer-motion";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";
import { useDisclosure } from "@nextui-org/react";
import ModalVerificarPdf from "./components/ModalVerificarPdf";
import FiltroVerificarCotizaciones from "./components/FiltroVerificarCotizaciones";
import TablaVerificacionPagos from "./components/TablaVerificacionPagos";
import { useSearchParams } from "react-router-dom";
import { API } from "../../../utils/api";

const ValidacionBancaDiaria = () => {
  const [searchParams] = useSearchParams();

  const fecha_inicio_params = searchParams.get("fecha_inicio");
  const fecha_final_params = searchParams.get("fecha_final");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectModal, setSelectModal] = useState("");
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Estado inicial tomando parámetros de la URL si existen
  const [filtros, setFiltros] = useState({
    vendedor: "Todos",
    tipoFiltro: "Pagos",
    estado_pago: "Todos",
    estado_cotizacion: "Todos",
    fecha_inicio: fecha_inicio_params || getTodayDate2(),
    fecha_final: fecha_final_params || getTodayDate(),
  });

  const handleChangeFiltro = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  // 2. Función de búsqueda que acepta un objeto de filtros (para datos frescos)
  const handleFindCotizaciones = useCallback(
    (filtrosAUsar = filtros) => {
      setLoading(true);

      const filtrosLimpios = {};
      Object.entries(filtrosAUsar).forEach(([key, value]) => {
        if (value !== "" && value !== "Todos") {
          filtrosLimpios[key] = value;
        }
      });

      const queryParams = new URLSearchParams(filtrosLimpios).toString();
      const url = `${API}/ventas/pagos-cotizaciones?${queryParams}`;

      axios
        .get(url, config)
        .then((res) => {
          setCotizaciones(res.data.cotizaciones || []);
        })
        .catch((err) => console.error("Error al obtener cotizaciones:", err))
        .finally(() => setLoading(false));
    },
    [filtros],
  );

  // 3. Efecto único para manejar carga inicial y cambios en la URL
  useEffect(() => {
    const filtrosActualizados = {
      ...filtros,
      fecha_inicio: fecha_inicio_params || filtros.fecha_inicio,
      fecha_final: fecha_final_params || filtros.fecha_final,
    };

    setFiltros(filtrosActualizados);
    handleFindCotizaciones(filtrosActualizados);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha_inicio_params, fecha_final_params]);

  return (
    <main className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
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
                Validación Banca Diaria
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 flex flex-col">
          <div className="flex flex-wrap items-end justify-between gap-4 px-2 pb-2 border-b-1 border-slate-200">
            <div className="flex-1 min-w-[300px]">
              <FiltroVerificarCotizaciones
                filtros={filtros}
                handleChangeFiltro={handleChangeFiltro}
                handleFindCotizaciones={() => handleFindCotizaciones(filtros)}
              />
            </div>
          </div>

          <TablaVerificacionPagos
            cotizaciones={cotizaciones}
            loading={loading}
            handleFindCotizaciones={() => handleFindCotizaciones(filtros)}
          />
        </main>
      </motion.div>

      {selectModal === "verificar_pdf" && (
        <ModalVerificarPdf
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindCotizaciones={() => handleFindCotizaciones(filtros)}
        />
      )}
    </main>
  );
};

export default ValidacionBancaDiaria;
