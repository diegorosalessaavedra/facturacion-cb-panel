import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../../../utils/getToken";

const TablaTotalesAsistenciaAdministrativos = ({
  semanaPlanillaId,
  colaboradorId,
  salarioBase = 0,
  adicionalesBase = 0,
  salarioTope = 0,
}) => {
  const [totalesBd, setTotalesBd] = useState(null);
  const [huboCambioManual, setHuboCambioManual] = useState(false);

  // NUEVO: Bandera para saber si la petición GET ya terminó.
  // Evita que intentemos hacer autoguardado de algo si todavía no sabemos su ID
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  const isReadyToTrack = useRef(false);

  // --- LÓGICA MATEMÁTICA AUTOMÁTICA ---
  const excesoCalculado = Math.max(0, salarioBase - salarioTope);
  const salario_exedente_calc = excesoCalculado;
  const adicionales_adicion_calc = excesoCalculado;
  const totalSalarioCalculado = salarioBase - salario_exedente_calc;
  const totalAdicionalesCalculado = adicionalesBase + adicionales_adicion_calc;

  const mostrar_salario_excedente =
    totalesBd && !huboCambioManual
      ? Number(totalesBd.salario_exedente || 0)
      : salario_exedente_calc;
  const mostrar_adicionales_adicion =
    totalesBd && !huboCambioManual
      ? Number(totalesBd.adicionales_adicion || 0)
      : adicionales_adicion_calc;
  const mostrar_salario_total =
    totalesBd && !huboCambioManual
      ? Number(totalesBd.salario_total || 0)
      : totalSalarioCalculado;
  const mostrar_adicionales_total =
    totalesBd && !huboCambioManual
      ? Number(totalesBd.adicionales_total || 0)
      : totalAdicionalesCalculado;

  const payloadRef = useRef({});

  useEffect(() => {
    payloadRef.current = {
      id: totalesBd?.id || null, // Siempre fresco
      semana_planilla_id: semanaPlanillaId,
      colaborador_id: colaboradorId,
      salario_exedente: mostrar_salario_excedente,
      totalSalario: mostrar_salario_total,
      adicionales_adicion: mostrar_adicionales_adicion,
      totalAdicionales: mostrar_adicionales_total,
    };
  }, [
    totalesBd,
    semanaPlanillaId,
    colaboradorId,
    mostrar_salario_excedente,
    mostrar_salario_total,
    mostrar_adicionales_adicion,
    mostrar_adicionales_total,
  ]);

  // --- GET: Carga datos de la BD ---
  const fetchTotales = () => {
    if (!semanaPlanillaId || !colaboradorId) return;

    setIsDbLoaded(false); // Bloqueamos guardado mientras carga

    const url = `${import.meta.env.VITE_URL_API}/totales-asistencia-administrativo/${semanaPlanillaId}/${colaboradorId}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data.totales?.id) {
          setTotalesBd(res.data.totales);
        }
      })
      .catch((err) => console.error("Error cargando totales:", err))
      .finally(() => {
        setIsDbLoaded(true); // Desbloqueamos
      });
  };

  useEffect(() => {
    fetchTotales();

    const timerInit = setTimeout(() => {
      isReadyToTrack.current = true;
    }, 2000); // Dar 2 segundos de gracia al componente padre para estabilizarse

    return () => clearTimeout(timerInit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semanaPlanillaId, colaboradorId]);

  // --- AUTOGUARDADO REACTIVO ---
  useEffect(() => {
    // CONDICIÓN CRÍTICA: No guardar si la página está cargando, o si el GET aún no termina
    if (!isReadyToTrack.current || !isDbLoaded) return;

    // Evitar que guarde todo en 0 si el padre aún no mandó los cálculos
    if (salarioBase === 0 && adicionalesBase === 0) return;

    setHuboCambioManual(true);

    const timer = setTimeout(() => {
      handleSave();
    }, 1500); // 1.5s de debounce para evitar envíos masivos

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salarioBase, adicionalesBase, salarioTope, isDbLoaded]);

  const handleSave = () => {
    const currentData = payloadRef.current;
    if (!currentData.semana_planilla_id || !currentData.colaborador_id) return;

    const payload = {
      // Tu backend usa esto para saber si hacer UPDATE o CREATE
      id: currentData.id,
      semana_planilla_id: currentData.semana_planilla_id,
      colaborador_id: currentData.colaborador_id,
      salario_exedente: currentData.salario_exedente,
      salario_adicion: 0.0,
      salario_total: currentData.totalSalario,
      adicionales_exedente: 0.0,
      adicionales_adicion: currentData.adicionales_adicion,
      adicionales_total: currentData.totalAdicionales,
    };

    const toastId = toast.loading("Actualizando totales...");

    // Siempre usamos POST, y que tu backend decida si crea (CREATE) o actualiza (UPDATE)
    // tal cual lo configuraste en tu backend.
    const url = `${import.meta.env.VITE_URL_API}/totales-asistencia-administrativo/${payload.id || "0"}`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Totales guardados", { id: toastId });

        if (res.data?.data) {
          // Actualizamos la BD local con el nuevo ID si se acaba de crear,
          // o con los datos frescos.
          setTotalesBd(res.data.data);
          setHuboCambioManual(false);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al guardar totales", { id: toastId });
      });
  };

  const thMainYellow =
    "bg-slate-800 border-b border-slate-900 p-2.5 font-bold uppercase text-[10px] tracking-widest text-white";
  const thSubYellow =
    "bg-green-100 border-r border-b border-green-300 p-3 font-bold uppercase text-[9px] tracking-wider text-slate-950 whitespace-nowrap";
  const thSubYellowLast =
    "bg-blue-100 border-b border-blue-300 p-3 px-1 font-bold uppercase text-[9px] tracking-wider text-slate-950 whitespace-nowrap";

  const tdTitle =
    "bg-sky-50 border-r border-b border-sky-200 p-2 font-bold text-[10px] text-left text-slate-600 uppercase";
  const tdValue =
    "bg-white border-r border-b border-slate-200 p-2 font-medium text-[9px] text-right text-slate-900 h-[33px]";
  const tdValueLast =
    "bg-white border-b border-slate-200 p-2 px-1 font-medium text-[9px] text-right text-slate-900 h-[33px]";

  const tdTotalTitle =
    "bg-slate-800 border-r border-slate-900 p-2 font-bold text-[10px] text-left text-slate-50 uppercase";
  const tdTotal =
    "bg-slate-50 border-r border-slate-300 p-2 font-extrabold text-[9px] text-right text-slate-900";
  const tdTotalLast =
    "bg-slate-50 border-slate-300 p-2 font-extrabold text-[9px] text-right text-slate-900";

  return (
    <div className="w-[300px] flex-1 overflow-hidden border border-slate-300 rounded-xl bg-white shadow-md custom-scrollbar">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            <th className="bg-white border-r border-b border-slate-200 p-2 w-[100px]"></th>
            <th colSpan={2} className={thMainYellow}>
              TOTALES
            </th>
          </tr>
          <tr>
            <th className="bg-slate-50 border-r border-b border-slate-200 p-2"></th>
            <th className={thSubYellow}>SALARIO</th>
            <th className={thSubYellowLast}>ADICIONALES</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-slate-50 transition-colors">
            <td className={tdTitle}>EXCEDENTE</td>
            <td className={tdValue}>
              {!isDbLoaded
                ? "..."
                : mostrar_salario_excedente > 0
                  ? `S/ ${mostrar_salario_excedente.toFixed(2)}`
                  : "-"}
            </td>
            <td className={tdValueLast}>-</td>
          </tr>
          <tr className="hover:bg-slate-50 transition-colors">
            <td className={tdTitle}>ADICIÓN</td>
            <td className={tdValue}>-</td>
            <td className={tdValueLast}>
              {!isDbLoaded
                ? "..."
                : mostrar_adicionales_adicion > 0
                  ? `S/ ${mostrar_adicionales_adicion.toFixed(2)}`
                  : "-"}
            </td>
          </tr>
          <tr className="bg-slate-50/50">
            <td className={tdTotalTitle}>TOTALES</td>
            <td className={tdTotal}>
              {!isDbLoaded ? "..." : `S/ ${mostrar_salario_total.toFixed(2)}`}
            </td>
            <td className={tdTotalLast}>
              {!isDbLoaded
                ? "..."
                : `S/ ${mostrar_adicionales_total.toFixed(2)}`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaTotalesAsistenciaAdministrativos;
