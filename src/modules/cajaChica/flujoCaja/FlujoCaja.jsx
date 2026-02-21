import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { API } from "../../../utils/api";
import config from "../../../utils/getToken";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { motion } from "framer-motion";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import FiltrosFlujo from "./components/FiltrosFlujo";
import TablaFlujo from "./components/TablaFlujo.js";

const FlujoCaja = () => {
  const [loading, setLoading] = useState(false);
  const [trabajadores, setTrabajadores] = useState([]);
  const [conceptos, setConceptos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [saldoInicialEnero, setSaldoInicialEnero] = useState(0);
  const [dataFiltros, setDataFiltros] = useState({
    trabajador_id: "TODOS",
    year: new Date().getFullYear(),
    mes: "TODOS",
    concepto: "TODOS",
    categoria: "TODOS",
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({ ...dataFiltros });

  const [totalesEmpresa, setTotalesEmpresa] = useState({
    ingresos: Array(12).fill(0),
    egresos: Array(12).fill(0),
  });

  // ================= PETICIONES A LA API =================
  const fetchData = () => {
    setLoading(true);

    Promise.all([
      axios.get(`${API}/caja-chica/conceptos-rendicion`, config),
      axios.get(`${API}/caja-chica/categoria-gasto`, config),
    ])
      .then(([resConceptos, resCategorias]) => {
        setConceptos(resConceptos.data.conceptoRendiciones || []);
        setCategorias(resCategorias.data.categoriaGastos || []);
      })
      .catch(handleAxiosError)
      .finally(() => setLoading(false));
  };

  const handleFindTrabajadores = () => {
    setLoading(true);

    const filtrosLimpios = Object.fromEntries(
      Object.entries(dataFiltros).filter(
        ([_, value]) => value !== "" && value !== "TODOS",
      ),
    );

    const queryParams = new URLSearchParams(filtrosLimpios).toString();
    const url = `${API}/caja-chica/trabajador/flujo-caja?${queryParams}`;
    axios
      .get(url, config)
      .then((res) => {
        setTrabajadores(res.data.trabajadores);
        setTotalesEmpresa(res.data.totales_empresa);
        setFiltrosAplicados({ ...dataFiltros });
      })
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
    handleFindTrabajadores();
  }, []);

  // ================= CÁLCULO CASCADA DE SALDOS =================
  const { saldosIniciales, saldosFinales, flujosNetos, totalesAnuales } =
    useMemo(() => {
      const iniciales = Array(12).fill(0);
      const finales = Array(12).fill(0);
      const netos = Array(12).fill(0);

      const saldoInicialNum = Number(saldoInicialEnero) || 0;
      iniciales[0] = saldoInicialNum;

      let sumaIngresos = 0;
      let sumaEgresos = 0;

      for (let i = 0; i < 12; i++) {
        const ing = Number(totalesEmpresa.ingresos[i]) || 0;
        const egr = Number(totalesEmpresa.egresos[i]) || 0;
        const neto = ing - egr;

        sumaIngresos += ing;
        sumaEgresos += egr;

        netos[i] = neto;
        finales[i] = iniciales[i] + neto;

        if (i < 11) iniciales[i + 1] = finales[i];
      }

      const flujoNetoAnual = sumaIngresos - sumaEgresos;

      return {
        saldosIniciales: iniciales.map((v) => Number(v.toFixed(2))),
        saldosFinales: finales.map((v) => Number(v.toFixed(2))),
        flujosNetos: netos.map((v) => Number(v.toFixed(2))),
        totalesAnuales: {
          ingresos: Number(sumaIngresos.toFixed(2)),
          egresos: Number(sumaEgresos.toFixed(2)),
          flujoNeto: Number(flujoNetoAnual.toFixed(2)),
        },
      };
    }, [saldoInicialEnero, totalesEmpresa]);

  // ================= PROCESAMIENTO DE DATOS =================
  const { tableData } = useMemo(() => {
    if (!trabajadores.length || !conceptos.length) {
      return { tableData: { ingresos: [], egresosGrouped: [] } };
    }

    const ingresos = trabajadores
      .filter((t) => t.ingresos && t.ingresos.some((val) => Number(val) > 0))
      .map((t) => ({
        id: `ing-${t.id}`,
        name: t.nombre_trabajador,
        values: t.ingresos.map((v) => Number(v)),
      }));

    const egresosGrouped = conceptos.map((concepto) => {
      const workersForConcept = [];
      const nombreConcepto = concepto.conceptos || concepto.concepto;

      trabajadores.forEach((t) => {
        const matchingEgresos =
          t.egresos?.filter((e) => e.concepto_rendicion === nombreConcepto) ||
          [];
        if (matchingEgresos.length > 0) {
          const monthlyTotals = Array(12).fill(0);
          const subItemsMap = {};

          categorias.forEach((cat) => {
            const nombreCat = cat.categoria;
            subItemsMap[nombreCat] = {
              id: `sub-${cat.id || nombreCat}-${t.id}`,
              label: nombreCat,
              values: Array(12).fill(0),
            };
          });

          matchingEgresos.forEach((eg) => {
            if (eg.fecha_rendida) {
              const month =
                parseInt(eg.fecha_rendida.split("T")[0].split("-")[1], 10) - 1;
              monthlyTotals[month] += Number(eg.total_gastos) || 0;

              if (Array.isArray(eg.datos_rendicion)) {
                eg.datos_rendicion.forEach((dato) => {
                  if (subItemsMap[dato.categoria]) {
                    subItemsMap[dato.categoria].values[month] +=
                      Number(dato.importe) || 0;
                  }
                });
              }
            }
          });

          const validSubItems = Object.values(subItemsMap).filter((sub) =>
            sub.values.some((val) => val > 0),
          );

          workersForConcept.push({
            id: `egr-trab-${t.id}-${concepto.id}`,
            name: t.nombre_trabajador,
            values: monthlyTotals.map((v) => Number(v.toFixed(2))),
            subItems: validSubItems.map((sub) => ({
              ...sub,
              values: sub.values.map((v) => Number(v.toFixed(2))),
            })),
          });
        }
      });

      return {
        id: `concepto-${concepto.id || nombreConcepto}`,
        categoria: nombreConcepto,
        items: workersForConcept,
      };
    });

    return { tableData: { ingresos, egresosGrouped } };
  }, [trabajadores, conceptos, categorias]);

  return (
    <main className="w-full h-screen bg-slate-50 p-4 pt-[90px] overflow-hidden flex flex-col font-sans">
      {loading && <LoadingSpinner />}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-[1700px] bg-white  w-full h-full mx-auto flex flex-col overflow-x-hidden overflow-y-auto"
      >
        {/* Cabecera general */}
        <header className="flex-none relative w-full min-h-[76px] bg-slate-900 rounded-t-2xl p-4 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-4 relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-1.5 rounded-lg shadow-md"
            >
              <img
                src="/logo.jpg"
                alt="logo"
                className="w-10 h-10 object-contain rounded"
              />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Flujo de Caja
              </h1>
              <p className="text-slate-300 text-xs font-medium">
                Control financiero anual
              </p>
            </div>
          </div>
        </header>

        {/* Contenido principal (Filtros + Tabla) */}
        <FiltrosFlujo
          setDataFiltros={setDataFiltros}
          dataFiltros={dataFiltros}
          handleFindTrabajadores={handleFindTrabajadores}
          conceptos={conceptos}
          categorias={categorias}
        />

        {/* Contenedor que limita el área de la tabla */}
        <div className="flex-1  min-h-[500px]  w-full rounded-xl overflow-hidden">
          <main className="w-full  h-full relative">
            <TablaFlujo
              tableData={tableData}
              totalesEmpresa={totalesEmpresa}
              saldosIniciales={saldosIniciales}
              saldosFinales={saldosFinales}
              flujosNetos={flujosNetos}
              totalesAnuales={totalesAnuales}
              saldoInicialEnero={saldoInicialEnero}
              setSaldoInicialEnero={setSaldoInicialEnero}
              dataFiltros={filtrosAplicados}
            />
          </main>
        </div>
      </motion.div>
    </main>
  );
};

export default FlujoCaja;
