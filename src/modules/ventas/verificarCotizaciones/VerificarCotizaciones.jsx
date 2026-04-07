import axios from "axios";
import config from "../../../utils/getToken";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { motion } from "framer-motion";
import { getTodayDate, getTodayDate2 } from "../../../assets/getTodayDate";
import { Button, useDisclosure } from "@nextui-org/react";
import ModalVerificarPdf from "./components/ModalVerificarPdf";
import FiltroVerificarCotizaciones from "./components/FiltroVerificarCotizaciones";
import TablaVerificacionPagos from "./components/TablaVerificacionPagos";

const VerificarCotizaciones = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectModal, setSelectModal] = useState();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState({
    tipoFiltro: "Pagos",
    estado_pago: "todos",
    estado_cotizacion: "todos",
    fecha_inicio: getTodayDate2(),
    fecha_final: getTodayDate(),
  });

  const handleChangeFiltro = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleFindCotizaciones = () => {
    setLoading(true);

    const filtrosLimpios = Object.fromEntries(
      Object.entries(filtros).filter(
        ([_, value]) => value !== "" && value !== "TODOS" && value !== "todos",
      ),
    );

    const queryParams = new URLSearchParams(filtrosLimpios).toString();
    const url = `${import.meta.env.VITE_URL_API}/ventas/pagos-cotizaciones?${queryParams}`;

    axios
      .get(url, config)
      .then((res) => {
        setCotizaciones(res.data.cotizaciones);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindCotizaciones();
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
        {/* HEADER */}
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
                Validación Banca Diaria{" "}
              </h1>
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 min-h-0 flex flex-col">
          {/* Contenedor de Filtros y Botón PDF */}
          <div className="flex flex-wrap items-end justify-between gap-4 px-2 pb-2 border-b-1 border-slate-200">
            <div className="flex-1 min-w-[300px]">
              <FiltroVerificarCotizaciones
                filtros={filtros}
                handleChangeFiltro={handleChangeFiltro}
                handleFindCotizaciones={handleFindCotizaciones}
              />
            </div>
            {/* El botón de verificar PDF ahora está alineado a la derecha y al fondo */}
            {/* <div className="mb-3">
              <Button
                color="danger"
                type="button"
                radius="sm"
                className="font-medium shadow-sm shadow-danger/30"
                onPress={() => {
                  setSelectModal("verificar_pdf");
                  onOpen();
                }}
              >
                Verificar Pdf
              </Button>
            </div> */}
          </div>
          <TablaVerificacionPagos
            cotizaciones={cotizaciones}
            loading={loading}
            handleFindCotizaciones={handleFindCotizaciones}
          />
        </main>
      </motion.div>

      {selectModal === "verificar_pdf" && (
        <ModalVerificarPdf
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindCotizaciones={handleFindCotizaciones}
        />
      )}
    </main>
  );
};

export default VerificarCotizaciones;
