import React from "react";
import { Input } from "@nextui-org/react";

const TrSaldoAnteriorAdmin = ({ colaborador, rowSpan, setSaldoAnteriorId }) => {
  // Aquí puedes agregar un useEffect que haga un GET a tu endpoint de Saldo Anterior Administrativo
  // y actualice el ID usando setSaldoAnteriorId(res.data.id)

  const inputUIClasses = {
    inputWrapper:
      "min-h-[25px] h-[25px] px-1 bg-white shadow-none hover:bg-slate-50 transition-colors",
    input: "text-[10px] text-center font-bold text-red-600",
  };

  return (
    <tr className="bg-slate-100 transition-colors">
      {/* CELDA AGRUPADORA (Nombre del trabajador) */}
      <td
        rowSpan={rowSpan}
        className="border-r border-slate-300 bg-blue-50/50 p-2 font-bold text-slate-800 uppercase text-[10px] whitespace-nowrap align-middle"
      >
        {colaborador?.apellidos_colaborador} <br />
        {colaborador?.nombre_colaborador}
      </td>

      {/* ESPACIOS VACÍOS HASTA SUBTOTALES (Abarca desde Feriado hasta Feriado Cálculo) */}
      <td
        colSpan={17}
        className="border-r border-b border-slate-200 text-right pr-4 font-bold text-red-600 text-[10px] uppercase"
      >
        Saldo Anterior
      </td>

      {/* INPUTS DE SALDO */}
      <td className="border-r border-b border-slate-200 p-1 min-w-[70px]">
        <Input
          type="number"
          step="0.01"
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          startContent={<span className="text-[9px] text-red-500">S/</span>}
        />
      </td>
      <td className="border-b border-slate-200 p-1 min-w-[70px]">
        <Input
          type="number"
          step="0.01"
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          startContent={<span className="text-[9px] text-red-500">S/</span>}
        />
      </td>
    </tr>
  );
};

export default TrSaldoAnteriorAdmin;
