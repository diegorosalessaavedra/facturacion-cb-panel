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
  // Solo necesitamos guardar el ID de la base de datos, el resto se calcula al vuelo
  const [totalesId, setTotalesId] = useState(null);
  const isFirstRender = useRef(true);

  // --- GET: Carga datos de la BD si existen para saber el ID ---
  const fetchTotales = () => {
    if (!semanaPlanillaId || !colaboradorId) return;
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/totales/${semanaPlanillaId}/${colaboradorId}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data.totales?.id) {
          setTotalesId(res.data.totales.id);
        }
      })
      .catch((err) => console.error("Error cargando totales:", err));
  };

  useEffect(() => {
    fetchTotales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semanaPlanillaId, colaboradorId]);

  // --- LÓGICA MATEMÁTICA AUTOMÁTICA ---
  const excesoCalculado = Math.max(0, salarioBase - salarioTope);
  const salario_exedente_calc = excesoCalculado;
  const adicionales_adicion_calc = excesoCalculado;

  const totalSalarioCalculado = salarioBase - salario_exedente_calc;
  const totalAdicionalesCalculado = adicionalesBase + adicionales_adicion_calc;

  // Usamos una referencia para tener siempre los cálculos más recientes al momento de autoguardar
  const calculosRef = useRef({
    salario_exedente: 0,
    adicionales_adicion: 0,
    totalSalario: 0,
    totalAdicionales: 0,
  });

  useEffect(() => {
    calculosRef.current = {
      salario_exedente: salario_exedente_calc,
      adicionales_adicion: adicionales_adicion_calc,
      totalSalario: totalSalarioCalculado,
      totalAdicionales: totalAdicionalesCalculado,
    };
  });

  // --- AUTOGUARDADO REACTIVO ---
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      handleSave();
    }, 900);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salarioBase, adicionalesBase, salarioTope]);

  const handleSave = () => {
    if (!semanaPlanillaId || !colaboradorId) return;

    const currentCalc = calculosRef.current;

    const payload = {
      id: totalesId, // null o el número de ID
      semana_planilla_id: semanaPlanillaId,
      colaborador_id: colaboradorId,
      salario_exedente: currentCalc.salario_exedente,
      salario_adicion: 0.0,
      salario_total: currentCalc.totalSalario,
      adicionales_exedente: 0.0,
      adicionales_adicion: currentCalc.adicionales_adicion,
      adicionales_total: currentCalc.totalAdicionales,
    };

    const toastId = toast.loading("Actualizando totales...");
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/totales/${payload.id || "0"}`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Totales guardados", { id: toastId });
        if (res.data?.data?.id && !totalesId) {
          setTotalesId(res.data.data.id);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al guardar totales", { id: toastId });
      });
  };

  // --- ESTILOS VISUALES IDÉNTICOS A TU TABLA PRINCIPAL ---
  const thMainYellow =
    "bg-slate-800 border-b border-slate-900 p-2.5 font-bold uppercase text-[8px] tracking-widest text-white";
  const thSubYellow =
    "bg-green-100 border-r border-b border-green-300 p-3 font-bold uppercase text-[7px] tracking-wider text-slate-950 whitespace-nowrap";
  const thSubYellowLast =
    "bg-blue-100 border-b border-blue-300 p-3 px-1 font-bold uppercase text-[7px] tracking-wider text-slate-950 whitespace-nowrap";

  const tdTitle =
    "bg-sky-50 border-r border-b border-sky-200 p-2 font-bold text-[8px] text-left text-slate-600 uppercase";
  const tdValue =
    "bg-white border-r border-b border-slate-200 p-2 font-medium text-[9px] text-right text-slate-900 h-[33px]";
  const tdValueLast =
    "bg-white border-b border-slate-200 p-2 px-1 font-medium text-[9px] text-right text-slate-900 h-[33px]";

  const tdTotalTitle =
    "bg-slate-800 border-r border-slate-900 p-2 font-bold text-[8px] text-left text-slate-50 uppercase";
  const tdTotal =
    "bg-slate-50 border-r border-slate-300 p-2 font-extrabold text-[9px] text-right text-slate-900";
  const tdTotalLast =
    "bg-slate-50 border-slate-300 p-2 font-extrabold text-[9px] text-right text-slate-900";

  return (
    <div className="w-[250px] flex-1 overflow-hidden border border-slate-300 rounded-xl bg-white shadow-md custom-scrollbar">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            <th className="bg-white border-r border-b border-slate-200 p-2 w-[80px]"></th>
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
              {salario_exedente_calc > 0
                ? `S/ ${salario_exedente_calc.toFixed(2)}`
                : "-"}
            </td>
            <td className={tdValueLast}>-</td>
          </tr>
          <tr className="hover:bg-slate-50 transition-colors">
            <td className={tdTitle}>ADICIÓN</td>
            <td className={tdValue}>-</td>
            <td className={tdValueLast}>
              {adicionales_adicion_calc > 0
                ? `S/ ${adicionales_adicion_calc.toFixed(2)}`
                : "-"}
            </td>
          </tr>
          <tr className="bg-slate-50/50">
            <td className={tdTotalTitle}>TOTALES</td>
            <td className={tdTotal}>S/ {totalSalarioCalculado.toFixed(2)}</td>
            <td className={tdTotalLast}>
              S/ {totalAdicionalesCalculado.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaTotalesAsistenciaAdministrativos;
