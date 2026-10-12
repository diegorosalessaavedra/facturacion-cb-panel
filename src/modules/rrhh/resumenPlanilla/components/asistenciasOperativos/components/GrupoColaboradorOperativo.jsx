import React, { useState, useEffect } from "react";
import TrAsistenciaOperativo from "./trAsistenciaAdministrativa/TrAsistenciaOperativo";
import TrSaldoAnteriorOperativo from "./TrSaldoAnteriorOperativo";

const GrupoColaboradorOperativo = ({
  colaborador,
  dias,
  totalSemanas,
  onTotalesCalculados,
  isFinalizado,
}) => {
  const totalFilas = 1 + dias.length + 1 + 1;

  const sueldoFeriadoBruto = Number(colaborador.valor_diario || 0) * 2;
  const sueldoPorDia = Number(colaborador.valor_diario || 0);
  const valorHora = Number(colaborador.valor_por_hora || 0);

  const topeSemanal = sueldoPorDia * 7;

  const [datosDias, setDatosDias] = useState({});
  const [datosDominical, setDatosDominical] = useState({});
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
    sumHrMinExtraMinutos = 0, // NUEVO: Acumulador en minutos para Hr y Min Extra
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
    
    // NUEVO: Lógica para sumar Hr y Min Extra
    if (r.hr_min_extra && r.hr_min_extra.includes(":")) {
      const [hStr, mStr] = r.hr_min_extra.split(":");
      sumHrMinExtraMinutos += (parseInt(hStr, 10) || 0) * 60 + (parseInt(mStr, 10) || 0);
    }
    
    // Sumamos las columnas financieras
    sumImporteHoras += Number(r.importe_horas || 0);
    sumImporteMinutos += Number(r.importe_minutos || 0);
    sumBono += Number(r.bono || 0);
    
    sumFeriados += Number(r.feriados || 0);
    sumSalario += Number(r.salario || 0);
    sumAdicionales += Number(r.adicionales || 0);
  });

  // Si tienes un día dominical con estos datos, también los sumamos (si aplica)
  sumTurnos += Number(datosDominical.turnos || 0);
  sumPlanilla += Number(datosDominical.total_planilla || 0);
  
  if (datosDominical.hr_min_extra && datosDominical.hr_min_extra.includes(":")) {
    const [hStr, mStr] = datosDominical.hr_min_extra.split(":");
    sumHrMinExtraMinutos += (parseInt(hStr, 10) || 0) * 60 + (parseInt(mStr, 10) || 0);
  }

  sumImporteHoras += Number(datosDominical.importe_horas || 0);
  sumImporteMinutos += Number(datosDominical.importe_minutos || 0);
  sumBono += Number(datosDominical.bono || 0);
  sumSalario += Number(datosDominical.salario || 0);
  sumAdicionales += Number(datosDominical.adicionales || 0);

  // Sumar Saldo Anterior
  sumSalario += Number(datosSaldo.salario || 0); 

  // Enviamos los totales al padre para que la tabla pequeña los procese
  useEffect(() => {
    if (onTotalesCalculados) {
      onTotalesCalculados(sumSalario, sumAdicionales, topeSemanal);
    }
  }, [sumSalario, sumAdicionales, topeSemanal, onTotalesCalculados]);

  // --- CONVERSIÓN VISUAL DE TIEMPOS ---
  // Para las horas normales
  sumHoras += Math.floor(sumMinutos / 60);
  sumMinutos = sumMinutos % 60;
  const totalHorasString = `${String(sumHoras).padStart(2, "0")}:${String(sumMinutos).padStart(2, "0")}`;

  // NUEVO: Para las horas extras
  const totalExtraHoras = Math.floor(sumHrMinExtraMinutos / 60);
  const totalExtraMinutos = sumHrMinExtraMinutos % 60;
  // Solo mostrar formato si hay horas extra, sino mostrar guion o 00:00
  const totalHrMinExtraString = sumHrMinExtraMinutos > 0 
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
        {/* colSpan=6 abarca: Fecha, Feriado, Turno, Actividad, Entrada, Salida */}
        <td colSpan={6} className="border-r border-slate-300 p-2 text-right">
          TOTALES
        </td>
        
        {/* Sumatorias individuales */}
        <td className="border-r border-slate-300 p-1">{totalHorasString}</td>
        <td className="border-r border-slate-300 p-1">{sumHoras}</td>
        <td className="border-r border-slate-300 p-1">{sumMinutos}</td>
        
        <td className="border-r border-slate-300 p-1 text-blue-400">
          {sumTurnos.toFixed(2)}
        </td>
        <td className="border-r border-slate-300 p-1 text-teal-400">
          S/ {sumPlanilla.toFixed(2)}
        </td>
        
        {/* NUEVO: Celda para Hr y Min Extra con la sumatoria ya calculada */}
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
        <td className="p-1 text-amber-400">
          S/ {sumAdicionales.toFixed(2)}
        </td>
      </tr>
    </tbody>
  );
};

export default GrupoColaboradorOperativo;