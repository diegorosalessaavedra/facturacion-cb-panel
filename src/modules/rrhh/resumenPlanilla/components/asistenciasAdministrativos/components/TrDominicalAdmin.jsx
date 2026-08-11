import React from "react";
import { Input } from "@nextui-org/react";

const TrDominicalAdmin = ({ saldoAnteriorId }) => {
  // Aquí irá la lógica POST/GET apuntando a dominicales_administrativos

  const inputUIClasses = {
    inputWrapper:
      "min-h-[25px] h-[25px] px-1 bg-white shadow-none transition-colors",
    input: "text-[10px] text-center text-slate-700",
  };

  return (
    <tr className="bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
      {/* El nombre ya está ocupando la primera columna (rowSpan) */}

      {/* Espacios hasta la columna "Turnos" */}
      <td
        colSpan={10}
        className="border-r border-b border-slate-200 text-center font-bold text-slate-700 text-[10px] uppercase"
      >
        DOMINICAL
      </td>

      {/* Inputs del Dominical */}
      <td className="border-r border-b border-slate-200 p-1">
        <Input
          type="number"
          defaultValue="1"
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
        />
      </td>
      <td className="border-r border-b border-slate-200 p-1">
        <Input
          type="number"
          step="0.01"
          defaultValue="40.00"
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
        />
      </td>

      {/* Espacio vacío para columnas que no aplican al dominical */}
      <td colSpan={5} className="border-r border-b border-slate-200"></td>

      <td className="border-r border-b border-slate-200 p-1">
        <Input
          type="number"
          step="0.01"
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
        />
      </td>
      <td className="border-b border-slate-200 p-1">
        <Input
          type="number"
          step="0.01"
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
        />
      </td>
    </tr>
  );
};

export default TrDominicalAdmin;
