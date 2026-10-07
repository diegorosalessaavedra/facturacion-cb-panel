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
  const diasLaborables = [];

  dias?.forEach((dia) => {
    const fechaObj = new Date(`${dia.fecha || dia.dia_plantilla}T00:00:00`);

    if (fechaObj.getDay() === 0) {
    } else {
      diasLaborables.push(dia);
    }
  });

  const totalFilas = 1 + diasLaborables.length + 1 + 1;

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

  let sumTardanza = 0,
    sumHoras = 0,
    sumMinutos = 0,
    sumTurnos = 0,
    sumPlanilla = 0,
    sumFeriados = 0,
    sumSalario = 0,
    sumAdicionales = 0;

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

  sumTurnos += Number(datosDominical.turnos || 0);
  sumPlanilla += Number(datosDominical.total_planilla || 0);
  sumSalario += Number(datosDominical.salario || 0);
  sumAdicionales += Number(datosDominical.adicionales || 0);

  sumSalario += Number(datosSaldo.saldo || 0);

  // NUEVO: Enviamos los totales al padre para que la tabla pequeña los procese
  useEffect(() => {
    if (onTotalesCalculados) {
      onTotalesCalculados(sumSalario, sumAdicionales, topeSemanal);
    }
  }, [sumSalario, sumAdicionales, topeSemanal, onTotalesCalculados]);

  sumHoras += Math.floor(sumMinutos / 60);
  sumMinutos = sumMinutos % 60;
  const totalHorasString = `${String(sumHoras).padStart(2, "0")}:${String(sumMinutos).padStart(2, "0")}`;

  return (
    <tbody className="border-b-4 border-slate-300">
      <TrSaldoAnteriorOperativo
        colaborador={colaborador}
        rowSpan={totalFilas}
        semanaPlanillaId={dias?.[0]?.semana_plantilla_id || null}
        onDataUpdate={setDatosSaldo}
        isFinalizado={isFinalizado}
      />

      {diasLaborables.map((dia) => (
        <TrAsistenciaOperativo
          key={dia.id}
          dia={dia}
          findColaborador={colaborador}
          sueldoPorDia={sueldoPorDia}
          valorHora={valorHora}
          sueldoFeriadoBruto={sueldoFeriadoBruto}
          onDataUpdate={(data) => handleUpdateDia(dia.id, data)}
          isFinalizado={isFinalizado}
        />
      ))}

      <tr className="bg-slate-800 font-bold text-[10px] text-slate-50 text-center">
        <td colSpan={5} className="border-r border-slate-300 p-2 text-right">
          TOTALES
        </td>
        <td className="border-r border-slate-300 p-1">{sumTardanza}</td>
        <td className="border-r border-slate-300 p-1">{totalHorasString}</td>
        <td className="border-r border-slate-300 p-1">{sumHoras}</td>
        <td className="border-r border-slate-300 p-1">{sumMinutos}</td>
        <td className="border-r border-slate-300 p-1 text-blue-400">
          {sumTurnos.toFixed(2)}
        </td>
        <td className="border-r border-slate-300 p-1 text-teal-400">
          S/ {sumPlanilla.toFixed(2)}
        </td>
        <td colSpan={4} className="border-r border-slate-300 p-1"></td>
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
