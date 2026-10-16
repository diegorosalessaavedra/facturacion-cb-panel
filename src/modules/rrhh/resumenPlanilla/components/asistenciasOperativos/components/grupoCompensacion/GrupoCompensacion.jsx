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
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  const sueldoFeriadoBruto = Number(colaborador.valor_diario || 0) * 2;
  const sueldoPorDia = Number(colaborador.valor_diario || 0);
  const valorHora = Number(colaborador.valor_por_hora || 0);

  const topeSemanal = sueldoPorDia * 7;

  const fetchAsistencias = () => {
    if (!semanaPlanillaId || !colaborador.id) return;
    setIsDbLoaded(false);

    const url = `${import.meta.env.VITE_URL_API}/asistencia-operativo/semana/${semanaPlanillaId}/${colaborador.id}`;

    axios
      .get(url, config)
      .then((res) => {
        setAsistenciasOperativas(res.data.asistencias || []);
      })
      .catch((err) => console.error("Error cargando asistencias:", err))
      .finally(() => setIsDbLoaded(true));
  };

  const fetchCompensacion = () => {
    if (!semanaPlanillaId || !colaborador.id) return;
    setIsDbLoaded(false);

    const url = `${import.meta.env.VITE_URL_API}/compensacion-operativa/${semanaPlanillaId}/${colaborador.id} `;

    axios
      .get(url, config)
      .then((res) => {
        setCompensacionOperativas(res.data.compensaciones || []);
      })
      .catch((err) => console.error("Error cargando compensaciones:", err))
      .finally(() => setIsDbLoaded(true));
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

  // --- VARIABLES ACUMULADORAS PARA TOTALES ---
  let sumTardanza = 0,
    sumHoras = 0,
    sumMinutos = 0,
    sumTurnos = 0,
    sumPlanilla = 0,
    sumHrMinExtraMinutos = 0,
    sumImporteHoras = 0,
    sumImporteMinutos = 0,
    sumBono = 0,
    sumFeriados = 0,
    sumSalario = 0,
    sumAdicionales = 0;

  Object.values(datosDias).forEach((r) => {
    sumTardanza += Number(r.tardanza_minutos || 0);
    sumHoras += Number(r.horas_enteras || 0);
    sumMinutos += Number(r.minutos_enteros || 0);
    sumTurnos += Number(r.turnos || 0);
    sumPlanilla += Number(r.total_planilla || 0);

    if (r.hr_min_extra && r.hr_min_extra.includes(":")) {
      const [hStr, mStr] = r.hr_min_extra.split(":");
      sumHrMinExtraMinutos +=
        (parseInt(hStr, 10) || 0) * 60 + (parseInt(mStr, 10) || 0);
    }

    sumImporteHoras += Number(r.importe_horas || 0);
    sumImporteMinutos += Number(r.importe_minutos || 0);
    sumBono += Number(r.bono || 0);
    sumFeriados += Number(r.feriados || 0);
    sumSalario += Number(r.salario || 0);
    sumAdicionales += Number(r.adicionales || 0);
  });

  useEffect(() => {
    if (onTotalesCalculados) {
      onTotalesCalculados(sumSalario, sumAdicionales, topeSemanal);
    }
  }, [sumSalario, sumAdicionales, topeSemanal, onTotalesCalculados]);

  sumHoras += Math.floor(sumMinutos / 60);
  sumMinutos = sumMinutos % 60;
  const totalHorasString = `${String(sumHoras).padStart(2, "0")}:${String(sumMinutos).padStart(2, "0")}`;

  const totalExtraHoras = Math.floor(sumHrMinExtraMinutos / 60);
  const totalExtraMinutos = sumHrMinExtraMinutos % 60;
  const totalHrMinExtraString =
    sumHrMinExtraMinutos > 0
      ? `${String(totalExtraHoras).padStart(2, "0")}:${String(totalExtraMinutos).padStart(2, "0")}`
      : "-";

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

  // Calculamos cuantas filas ocupará el nombre del colaborador
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
          isFirstRow={index === 0} // <-- Le decimos si es la primera fila
          rowSpan={totalFilas} // <-- Le pasamos el alto de la columna de nombre
        />
      ))}

      <tr className="bg-slate-800 font-bold text-[10px] text-slate-50 text-center">
        {/* Sumamos un colSpan de 7 porque agregamos el nuevo Select */}
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
