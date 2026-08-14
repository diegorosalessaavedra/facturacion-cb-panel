import React, { useState } from "react";
import TrSaldoAnteriorAdmin from "./TrSaldoAnteriorAdmin";
import TrAsistenciaAdministrativa from "./TrAsistenciaAdministrativa";
import TrDominicalAdmin from "./TrDominicalAdmin";

const GrupoColaboradorAdministrativo = ({
  colaborador,
  dias,
  totalSemanas,
}) => {
  const diasLaborables = [];
  let diaDomingo = null;

  dias?.forEach((dia) => {
    const fechaObj = new Date(`${dia.fecha || dia.dia_plantilla}T00:00:00`);
    if (fechaObj.getDay() === 0) {
      diaDomingo = dia;
    } else {
      diasLaborables.push(dia);
    }
  });

  const totalFilas = 1 + diasLaborables.length + 1 + 1;
  const sueldoMensual = colaborador?.sueldos?.[0]?.sueldo || 0;
  const divisorSemanas = totalSemanas > 0 ? totalSemanas : 1;
  const divisorDias = dias?.length > 0 ? dias.length : 1;
  const calculoBruto = sueldoMensual / divisorSemanas / divisorDias;
  const sueldoFeriadoBruto = (Number(sueldoMensual / 30) * 2).toFixed(2);
  const sueldoPorDia = Number(calculoBruto.toFixed(2));

  const [saldoAnteriorId, setSaldoAnteriorId] = useState(null);

  // --- ESTADOS PARA RECOLECTAR DATOS DE LOS HIJOS ---
  const [datosDias, setDatosDias] = useState({});
  const [datosDominical, setDatosDominical] = useState({});

  // Función que reciben los días laborables para reportar sus cambios
  const handleUpdateDia = (diaId, data) => {
    setDatosDias((prev) => ({
      ...prev,
      [diaId]: data,
    }));
  };

  // --- CÁLCULO DE TOTALES GENERALES ---
  let sumTardanza = 0,
    sumHoras = 0,
    sumMinutos = 0,
    sumTurnos = 0,
    sumPlanilla = 0,
    sumFeriados = 0,
    sumSalario = 0,
    sumAdicionales = 0;

  // Sumamos todos los días laborables
  Object.values(datosDias).forEach((r) => {
    sumTardanza += Number(r.tardanza_minutos || 0);
    sumHoras += Number(r.horas_enteras || 0);
    sumMinutos += Number(r.minutos_enteros || 0);
    sumTurnos += Number(r.turnos || 0);
    sumPlanilla += Number(r.total_planilla || 0);
    sumFeriados += Number(r.feriados || 0);
    sumSalario += Number(r.salario || 0);
    sumAdicionales += Number(r.adicionales || 0);
  });

  // Sumamos el dominical
  sumTurnos += Number(datosDominical.turnos || 0);
  sumPlanilla += Number(datosDominical.total_planilla || 0);
  sumSalario += Number(datosDominical.salario || 0);
  sumAdicionales += Number(datosDominical.adicionales || 0);

  // Formateo correcto de Horas y Minutos Totales (Ej: 90 min = 1h 30m)
  sumHoras += Math.floor(sumMinutos / 60);
  sumMinutos = sumMinutos % 60;
  const totalHorasString = `${String(sumHoras).padStart(2, "0")}:${String(sumMinutos).padStart(2, "0")}`;

  return (
    <tbody className="border-b-4 border-slate-300">
      <TrSaldoAnteriorAdmin
        colaborador={colaborador}
        rowSpan={totalFilas}
        semanaPlanillaId={dias?.[0]?.semana_plantilla_id || null}
      />

      {diasLaborables.map((dia) => (
        <TrAsistenciaAdministrativa
          key={dia.id}
          dia={dia}
          findColaborador={colaborador}
          sueldoPorDia={sueldoPorDia}
          sueldoFeriadoBruto={sueldoFeriadoBruto}
          onDataUpdate={(data) => handleUpdateDia(dia.id, data)} // <-- PASAMOS EL CALLBACK
        />
      ))}

      <TrDominicalAdmin
        colaborador_id={colaborador?.id}
        diaDomingo={diaDomingo}
        sueldoPorDia={sueldoPorDia}
        onDataUpdate={setDatosDominical} // <-- PASAMOS EL CALLBACK
      />

      {/* FILA DE TOTALES CON LOS CÁLCULOS ALINEADOS A SUS COLUMNAS */}
      <tr className="bg-slate-200 font-bold text-[10px] text-slate-800 text-center">
        {/* Abarca: Feriado, Vacaciones, Turno, Actividad, Entrada, Salida */}
        <td colSpan={7} className="border-r border-slate-300 p-2 text-right">
          TOTALES
        </td>

        <td className="border-r border-slate-300 p-1">{sumTardanza}</td>
        <td className="border-r border-slate-300 p-1">{totalHorasString}</td>
        <td className="border-r border-slate-300 p-1">{sumHoras}</td>
        <td className="border-r border-slate-300 p-1">{sumMinutos}</td>
        <td className="border-r border-slate-300 p-1 text-blue-700">
          {sumTurnos.toFixed(2)}
        </td>
        <td className="border-r border-slate-300 p-1 text-teal-700">
          S/ {sumPlanilla.toFixed(2)}
        </td>

        {/* Abarca: Hr Extra, Importe Horas, Importe Minutos, Bono */}
        <td colSpan={4} className="border-r border-slate-300 p-1"></td>

        <td className="border-r border-slate-300 p-1 text-teal-700">
          S/ {sumFeriados.toFixed(2)}
        </td>
        <td className="border-r border-slate-300 p-1 text-amber-700">
          S/ {sumSalario.toFixed(2)}
        </td>
        <td className="p-1 text-amber-700">S/ {sumAdicionales.toFixed(2)}</td>
      </tr>
    </tbody>
  );
};

export default GrupoColaboradorAdministrativo;
