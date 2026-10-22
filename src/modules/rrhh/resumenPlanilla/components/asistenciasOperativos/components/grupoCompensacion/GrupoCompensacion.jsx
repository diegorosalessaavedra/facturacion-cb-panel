import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import TrAsistenciaCompensacion from "./TrAsistenciaCompensacion";

const GrupoCompensacion = ({
  semanaPlanillaId,
  colaborador,
  isFinalizado,
  onTotalesCalculados,
}) => {
  const [asistenciasOperativas, setAsistenciasOperativas] = useState([]);
  const [compensacionOperativas, setCompensacionOperativas] = useState([]);
  const [datosDias, setDatosDias] = useState({});

  const sueldoFeriadoBruto = Number(colaborador.valor_diario || 0) * 2;
  const sueldoPorDia = Number(colaborador.valor_diario || 0);
  const valorHora = Number(colaborador.valor_por_hora || 0);

  const topeSemanal = sueldoPorDia * 7;

  const fetchAsistencias = () => {
    if (!semanaPlanillaId || !colaborador.id) return;

    const url = `${import.meta.env.VITE_URL_API}/asistencia-operativo/semana/${semanaPlanillaId}/${colaborador.id}`;
    axios
      .get(url, config)
      .then((res) => {
        setAsistenciasOperativas(res.data.asistencias || []);
      })
      .catch((err) => console.error("Error cargando asistencias:", err));
  };

  const fetchCompensacion = () => {
    if (!semanaPlanillaId || !colaborador.id) return;

    const url = `${import.meta.env.VITE_URL_API}/compensacion-operativa/${semanaPlanillaId}/${colaborador.id}`;
    axios
      .get(url, config)
      .then((res) => {
        setCompensacionOperativas(res.data.compensaciones || []);
      })
      .catch((err) => console.error("Error cargando compensaciones:", err));
  };

  useEffect(() => {
    fetchAsistencias();
    fetchCompensacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semanaPlanillaId, colaborador.id]);

  const handleUpdateDia = (diaId, data) => {
    const key = diaId || "nuevo";
    setDatosDias((prev) => ({ ...prev, [key]: data }));
  };

  // --- VARIABLES ACUMULADORAS ESTRICTAMENTE NECESARIAS ---
  let sumHoras = 0,
    sumMinutos = 0,
    sumPlanilla = 0,
    sumImporteHoras = 0,
    sumImporteMinutos = 0,
    sumBono = 0,
    sumSalario = 0,
    sumAdicionales = 0; // Se mantiene porque se envía al componente padre

  Object.values(datosDias).forEach((r) => {
    sumHoras += Number(r.horas_enteras || 0);
    sumMinutos += Number(r.minutos_enteros || 0);
    sumPlanilla += Number(r.total_planilla || 0);
    sumImporteHoras += Number(r.importe_horas || 0);
    sumImporteMinutos += Number(r.importe_minutos || 0);
    sumBono += Number(r.bono || 0);
    sumSalario += Number(r.salario || 0);
    sumAdicionales += Number(r.adicionales || 0);
  });

  // Notificar al componente padre
  useEffect(() => {
    if (onTotalesCalculados) {
      onTotalesCalculados(sumSalario, sumAdicionales, topeSemanal);
    }
  }, [sumSalario, sumAdicionales, topeSemanal, onTotalesCalculados]);

  // Conversión de horas y minutos
  sumHoras += Math.floor(sumMinutos / 60);
  sumMinutos = sumMinutos % 60;
  const totalHorasString = `${String(sumHoras).padStart(2, "0")}:${String(sumMinutos).padStart(2, "0")}`;

  const compensacionesMostrar =
    compensacionOperativas.length > 0
      ? compensacionOperativas
      : [
          {
            id: null,
            semana_planilla_id: semanaPlanillaId,
            colaborador_id: colaborador.id,
          },
        ];

  const totalFilas = compensacionesMostrar.length + 1;

  return (
    <tbody className="border-b-4 border-slate-300">
      {compensacionesMostrar.map((comp, index) => (
        <TrAsistenciaCompensacion
          key={comp.id || `nuevo-${index}`}
          compensacion={comp}
          dia={comp}
          findColaborador={colaborador}
          sueldoPorDia={sueldoPorDia}
          valorHora={valorHora}
          sueldoFeriadoBruto={sueldoFeriadoBruto}
          onDataUpdate={(data) => handleUpdateDia(comp.id, data)}
          isFinalizado={isFinalizado}
          bono_extraordinario={colaborador.bono_extraordinario || 0}
          asistenciasOperativas={asistenciasOperativas}
          isFirstRow={index === 0}
          rowSpan={totalFilas}
        />
      ))}

      <tr className="bg-slate-800 font-bold text-[10px] text-slate-50 text-center">
        <td colSpan={6} className="border-r border-slate-300 p-2 text-right">
          TOTALES
        </td>
        <td className="border-r border-slate-300 p-1">{totalHorasString}</td>
        <td className="border-r border-slate-300 p-1">{sumHoras}</td>
        <td className="border-r border-slate-300 p-1">{sumMinutos}</td>

        <td className="border-r border-slate-300 p-1 text-teal-400">
          S/ {sumPlanilla.toFixed(2)}
        </td>
        <td className="border-r border-slate-300 p-1 text-teal-400">
          S/ {sumImporteHoras.toFixed(2)}
        </td>
        <td className="border-r border-slate-300 p-1 text-teal-400">
          S/ {sumImporteMinutos.toFixed(2)}
        </td>
        <td className="border-r border-slate-300 p-1 text-teal-400">
          S/ {sumBono.toFixed(2)}
        </td>
        <td className="border-r border-slate-300 p-1 text-amber-400">
          S/ {sumSalario.toFixed(2)}
        </td>
      </tr>
    </tbody>
  );
};

export default GrupoCompensacion;
