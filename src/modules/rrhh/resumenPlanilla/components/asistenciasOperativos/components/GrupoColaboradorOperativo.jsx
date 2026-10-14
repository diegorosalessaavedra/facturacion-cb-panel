import React, { useState, useEffect } from "react";
import TrAsistenciaOperativo from "./trAsistenciaOperativo/TrAsistenciaOperativo";
import TrSaldoAnteriorOperativo from "./TrSaldoAnteriorOperativo";

const GrupoColaboradorOperativo = ({
  colaborador,
  dias,
  onTotalesCalculados,
  isFinalizado,
}) => {
  const totalFilas = 1 + dias.length + 1 + 1;
  const sueldoMensual = colaborador?.sueldos?.[0]?.sueldo || 0;
  const sueldoSemanal = sueldoMensual / 4;

  const sueldoFeriadoBruto = Number(colaborador?.valor_diario || 0) * 2;
  const sueldoPorDia = Number(colaborador?.valor_diario || 0);
  const valorHora = Number(colaborador?.valor_por_hora || 0);

  // VALIDACIÓN APLICADA: El tope ahora es el sueldo base semanal en lugar de sueldoPorDia * 7
  const topeSemanal = sueldoSemanal;

  const [datosDias, setDatosDias] = useState({});
  const [datosSaldo, setDatosSaldo] = useState({});

  const handleUpdateDia = (diaId, data) => {
    setDatosDias((prev) => ({ ...prev, [diaId]: data }));
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

  sumSalario += Number(datosSaldo.salario || 0);

  // Enviamos los totales al padre (incluyendo el tope validado)
  useEffect(() => {
    if (onTotalesCalculados) {
      onTotalesCalculados(sumSalario, sumAdicionales, topeSemanal);
    }
  }, [sumSalario, sumAdicionales, topeSemanal, onTotalesCalculados]);

  // --- CONVERSIÓN VISUAL DE TIEMPOS ---
  sumHoras += Math.floor(sumMinutos / 60);
  sumMinutos = sumMinutos % 60;
  const totalHorasString = `${String(sumHoras).padStart(2, "0")}:${String(sumMinutos).padStart(2, "0")}`;

  const totalExtraHoras = Math.floor(sumHrMinExtraMinutos / 60);
  const totalExtraMinutos = sumHrMinExtraMinutos % 60;
  const totalHrMinExtraString =
    sumHrMinExtraMinutos > 0
      ? `${String(totalExtraHoras).padStart(2, "0")}:${String(totalExtraMinutos).padStart(2, "0")}`
      : "-";

  return (
    <tbody className="border-b-4 border-slate-300">
      <TrSaldoAnteriorOperativo
        colaborador={colaborador}
        rowSpan={totalFilas}
        semanaPlanillaId={dias?.[0]?.semana_plantilla_id || null}
        onDataUpdate={setDatosSaldo}
        isFinalizado={isFinalizado}
      />

      {dias.map((dia) => (
        <TrAsistenciaOperativo
          key={dia.id}
          dia={dia}
          findColaborador={colaborador}
          sueldoPorDia={sueldoPorDia}
          valorHora={valorHora}
          sueldoFeriadoBruto={sueldoFeriadoBruto}
          onDataUpdate={(data) => handleUpdateDia(dia.id, data)}
          isFinalizado={isFinalizado}
          bono_extraordinario={colaborador.bono_extraordinario || 0}
        />
      ))}

      <tr className="bg-slate-800 font-bold text-[10px] text-slate-50 text-center">
        <td colSpan={6} className="border-r border-slate-300 p-2 text-right">
          TOTALES
        </td>
        <td className="border-r border-slate-300 p-1">{totalHorasString}</td>
        <td className="border-r border-slate-300 p-1">{sumHoras}</td>
        <td className="border-r border-slate-300 p-1">{sumMinutos}</td>
        <td className="border-r border-slate-300 p-1 text-blue-400">
          {sumTurnos}
        </td>
        <td className="border-r border-slate-300 p-1 text-teal-400">
          S/ {sumPlanilla.toFixed(2)}
        </td>
        <td className="border-r border-slate-300 p-1 text-blue-300">
          {totalHrMinExtraString}
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
        <td className="border-r border-slate-300 p-1 text-teal-400">
          S/ {sumFeriados.toFixed(2)}
        </td>
        <td className="border-r border-slate-300 p-1 text-amber-400">
          S/ {sumSalario.toFixed(2)}
        </td>
        <td className="p-1 text-amber-400">S/ {sumAdicionales.toFixed(2)}</td>
      </tr>
    </tbody>
  );
};

export default GrupoColaboradorOperativo; 