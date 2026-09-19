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
  // 1. Guardamos todo el objeto que viene de la BD, no solo el ID
  const [totalesBd, setTotalesBd] = useState(null);

  // 2. Bandera para saber si mostramos la BD o mostramos los nuevos cálculos
  const [huboCambioManual, setHuboCambioManual] = useState(false);

  // 3. Ref para darle tiempo al padre de cargar sus cálculos iniciales sin disparar guardados falsos
  const isReadyToTrack = useRef(false);

  // --- LÓGICA MATEMÁTICA AUTOMÁTICA ---
  const excesoCalculado = Math.max(0, salarioBase - salarioTope);
  const salario_exedente_calc = excesoCalculado;
  const adicionales_adicion_calc = excesoCalculado;
  const totalSalarioCalculado = salarioBase - salario_exedente_calc;
  const totalAdicionalesCalculado = adicionalesBase + adicionales_adicion_calc;

  // --- VALORES A MOSTRAR (DECISIÓN: BD vs CALCULADOS) ---
  // Si tenemos datos en la BD y NO ha habido cambios manuales, mostramos lo de la BD.
  // Si no, mostramos los calculados en tiempo real.
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

  // Referencia unificada para el payload del autoguardado (Siempre tiene los valores más recientes)
  const payloadRef = useRef({});

  useEffect(() => {
    payloadRef.current = {
      id: totalesBd?.id || null,
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
    const url = `${import.meta.env.VITE_URL_API}/totales-asistencia-administrativo/${semanaPlanillaId}/${colaboradorId}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data.totales?.id) {
          setTotalesBd(res.data.totales); // Guardamos TODO el registro completo
        }
      })
      .catch((err) => console.error("Error cargando totales:", err));
  };

  useEffect(() => {
    fetchTotales();

    // Damos un periodo de gracia de 2 segundos para que la tabla padre termine de
    // inicializar sus sumas (0 -> 1500) y esto no se considere una "edición"
    const timerInit = setTimeout(() => {
      isReadyToTrack.current = true;
    }, 2000);

    return () => clearTimeout(timerInit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semanaPlanillaId, colaboradorId]);

  // --- AUTOGUARDADO REACTIVO ---
  useEffect(() => {
    // Si la página recién está cargando (primeros 2s), ignorar los cambios.
    if (!isReadyToTrack.current) return;

    // Si pasamos aquí, significa que el usuario editó una asistencia (pasados los 2s)
    // Encendemos la bandera para que la UI deje de usar la BD antigua y use los nuevos cálculos
    setHuboCambioManual(true);

    const timer = setTimeout(() => {
      handleSave();
    }, 900);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salarioBase, adicionalesBase, salarioTope]); // Dependemos de las props calculadas

  const handleSave = () => {
    const currentData = payloadRef.current;
    if (!currentData.semana_planilla_id || !currentData.colaborador_id) return;

    const payload = {
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
    const url = `${import.meta.env.VITE_URL_API}/totales-asistencia-administrativo/${payload.id || "0"}`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Totales guardados", { id: toastId });

        // Si el servidor nos devuelve el registro guardado, actualizamos la BD local
        if (res.data?.data) {
          setTotalesBd(res.data.data);
          setHuboCambioManual(false); // Volvemos a mostrar la BD, ya que ahora está sincronizada
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al guardar totales", { id: toastId });
      });
  };

  // --- ESTILOS VISUALES IDÉNTICOS A TU TABLA PRINCIPAL ---
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
              {mostrar_salario_excedente > 0
                ? `S/ ${mostrar_salario_excedente.toFixed(2)}`
                : "-"}
            </td>
            <td className={tdValueLast}>-</td>
          </tr>
          <tr className="hover:bg-slate-50 transition-colors">
            <td className={tdTitle}>ADICIÓN</td>
            <td className={tdValue}>-</td>
            <td className={tdValueLast}>
              {mostrar_adicionales_adicion > 0
                ? `S/ ${mostrar_adicionales_adicion.toFixed(2)}`
                : "-"}
            </td>
          </tr>
          <tr className="bg-slate-50/50">
            <td className={tdTotalTitle}>TOTALES</td>
            <td className={tdTotal}>S/ {mostrar_salario_total.toFixed(2)}</td>
            <td className={tdTotalLast}>
              S/ {mostrar_adicionales_total.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaTotalesAsistenciaAdministrativos;
