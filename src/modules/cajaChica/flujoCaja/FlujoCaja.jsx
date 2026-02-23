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
  const [saldoFlujo, setSaldoFlujo] = useState(null);

  const [dataFiltros, setDataFiltros] = useState({
    trabajador_id: "TODOS",
    year: new Date().getFullYear(),
    mes: "TODOS",
    concepto: "TODOS",
    categoria: "TODOS",
  });
  console.log(trabajadores);

  const [filtrosAplicados, setFiltrosAplicados] = useState({ ...dataFiltros });

  const [totalesEmpresa, setTotalesEmpresa] = useState({
    ingresos: Array(12).fill(0),
    egresos: Array(12).fill(0),
  });

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

    axios
      .get(`${API}/caja-chica/trabajador/flujo-caja?${queryParams}`, config)
      .then((res) => {
        setTrabajadores(res.data.trabajadores || []);
        setTotalesEmpresa(
          res.data.totales_empresa || {
            ingresos: Array(12).fill(0),
            egresos: Array(12).fill(0),
          },
        );
        setFiltrosAplicados({ ...dataFiltros });

        setSaldoFlujo(res.data.saldoFlujo);
      })
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    handleFindTrabajadores();
  }, []);

  // CÁLCULO CASCADA DE SALDOS (MOTOR FINANCIERO)
  const { saldosIniciales, saldosFinales, flujosNetos, totalesAnuales } =
    useMemo(() => {
      const iniciales = Array(12).fill(0);
      const finales = Array(12).fill(0);
      const netos = Array(12).fill(0);
      const saldoInicialNum = Number(saldoFlujo?.saldo) || 0;

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

      return {
        saldosIniciales: iniciales.map((v) => Number(v.toFixed(2))),
        saldosFinales: finales.map((v) => Number(v.toFixed(2))),
        flujosNetos: netos.map((v) => Number(v.toFixed(2))),
        totalesAnuales: {
          ingresos: Number(sumaIngresos.toFixed(2)),
          egresos: Number(sumaEgresos.toFixed(2)),
          flujoNeto: Number((sumaIngresos - sumaEgresos).toFixed(2)),
        },
      };
    }, [saldoFlujo?.saldo, totalesEmpresa]);

  // PROCESAMIENTO DE DATOS BASADO EN FECHA_USO
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

    const egresosGrouped = conceptos
      .map((concepto) => {
        const workersForConcept = [];
        const nombreConcepto = concepto.conceptos || concepto.concepto;

        trabajadores.forEach((t) => {
          // Filtrar rendiciones que pertenecen a este concepto
          const matchingEgresos =
            t.egresos?.filter((e) => e.concepto_rendicion === nombreConcepto) ||
            [];

          if (matchingEgresos.length > 0) {
            const monthlyTotals = Array(12).fill(0);
            const subItemsMap = {};

            // Inicializar mapa de categorías para este trabajador/concepto
            categorias.forEach((cat) => {
              subItemsMap[cat.categoria] = {
                id: `sub-${cat.id}-${t.id}-${concepto.id}`,
                label: cat.categoria,
                values: Array(12).fill(0),
              };
            });

            // REESTRUCTURACIÓN: Sumar basándonos en fecha_uso de cada comprobante
            matchingEgresos.forEach((eg) => {
              if (Array.isArray(eg.datos_rendicion)) {
                eg.datos_rendicion.forEach((dato) => {
                  if (dato.fecha_uso) {
                    const mesIndex =
                      parseInt(dato.fecha_uso.split("-")[1], 10) - 1;
                    const importe = Number(dato.importe) || 0;

                    // Sumar al total del trabajador en este mes/concepto
                    monthlyTotals[mesIndex] += importe;

                    // Sumar a la categoría específica
                    if (subItemsMap[dato.categoria]) {
                      subItemsMap[dato.categoria].values[mesIndex] += importe;
                    }
                  }
                });
              }
            });

            // Solo agregar si hay gastos reales en el periodo
            if (monthlyTotals.some((v) => v > 0)) {
              workersForConcept.push({
                id: `egr-trab-${t.id}-${concepto.id}`,
                name: t.nombre_trabajador,
                values: monthlyTotals.map((v) => Number(v.toFixed(2))),
                subItems: Object.values(subItemsMap)
                  .filter((sub) => sub.values.some((val) => val > 0))
                  .map((sub) => ({
                    ...sub,
                    values: sub.values.map((v) => Number(v.toFixed(2))),
                  })),
              });
            }
          }
        });

        return {
          id: `concepto-${concepto.id || nombreConcepto}`,
          categoria: nombreConcepto,
          items: workersForConcept,
        };
      })
      .filter((group) => group.items.length > 0); // Ocultar conceptos vacíos

    return { tableData: { ingresos, egresosGrouped } };
  }, [trabajadores, conceptos, categorias]);

  return (
    <main className="w-full h-screen bg-slate-50 p-4 pt-[90px] overflow-hidden flex flex-col font-sans">
      {loading && <LoadingSpinner />}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-[1700px] bg-white w-full h-full mx-auto flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-slate-200"
      >
        <header className="flex-none relative w-full min-h-[76px] bg-slate-900 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-lg shadow-md">
              <img
                src="/logo.jpg"
                alt="logo"
                className="w-10 h-10 object-contain rounded"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Flujo de Caja
              </h1>
              <p className="text-slate-300 text-xs font-medium uppercase tracking-wider">
                Control Anual {filtrosAplicados.year}
              </p>
            </div>
          </div>
        </header>

        <div className="p-4 flex flex-col gap-4 overflow-hidden flex-1">
          <FiltrosFlujo
            setDataFiltros={setDataFiltros}
            dataFiltros={dataFiltros}
            handleFindTrabajadores={handleFindTrabajadores}
            conceptos={conceptos}
            categorias={categorias}
          />

          <div className="flex-1 overflow-hidden relative border border-slate-200 rounded-xl bg-slate-50/30">
            <main className="w-full h-full relative">
              <TablaFlujo
                tableData={tableData}
                totalesEmpresa={totalesEmpresa}
                saldosIniciales={saldosIniciales}
                saldosFinales={saldosFinales}
                flujosNetos={flujosNetos}
                totalesAnuales={totalesAnuales}
                dataFiltros={filtrosAplicados}
                saldoFlujo={saldoFlujo}
                setSaldoFlujo={setSaldoFlujo}
              />
            </main>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default FlujoCaja;
