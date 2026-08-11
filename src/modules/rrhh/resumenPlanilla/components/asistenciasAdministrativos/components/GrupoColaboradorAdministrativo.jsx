import React, { useState } from "react";
import TrSaldoAnteriorAdmin from "./TrSaldoAnteriorAdmin";
import TrAsistenciaAdministrativa from "./TrAsistenciaAdministrativa";
import TrDominicalAdmin from "./TrDominicalAdmin";

const GrupoColaboradorAdministrativo = ({ colaborador, dias }) => {
  // Calculamos cuántas filas abarcará el rowSpan:
  // 1 (Saldo) + cantidad de días + 1 (Dominical) + 1 (Totales)
  const totalFilas = 1 + (dias?.length || 0) + 1 + 1;

  console.log(totalFilas);

  const [saldoAnteriorId, setSaldoAnteriorId] = useState(null);

  return (
    <tbody className="border-b-4 border-slate-300">
      {/* 1. FILA SALDO ANTERIOR (Contiene el rowSpan del nombre) */}
      <TrSaldoAnteriorAdmin
        colaborador={colaborador}
        rowSpan={totalFilas}
        setSaldoAnteriorId={setSaldoAnteriorId}
      />

      {/* 2. FILAS DE ASISTENCIA DIARIA (Lunes a Sábado) */}
      {dias?.map((dia) => (
        <TrAsistenciaAdministrativa
          key={dia.id}
          dia={dia}
          findColaborador={colaborador}
        />
      ))}

      {/* 3. FILA DOMINICAL */}
      <TrDominicalAdmin saldoAnteriorId={saldoAnteriorId} />

      {/* 4. FILA DE TOTALES (Opcional, estructura básica) */}
      <tr className="bg-slate-200 font-bold text-[10px]">
        {/* El nombre ya está ocupando la primera columna, así que empezamos desde la columna 2 */}
        <td colSpan={7} className="border-r border-slate-300 p-2 text-right">
          TOTALES
        </td>
        {/* Aquí irían los inputs o textos estáticos con las sumatorias */}
        <td className="border-r border-slate-300 p-2">...</td>
        <td colSpan={11}></td>
      </tr>
    </tbody>
  );
};

export default GrupoColaboradorAdministrativo;
