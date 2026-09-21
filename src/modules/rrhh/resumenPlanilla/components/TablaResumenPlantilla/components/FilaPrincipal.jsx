import React, { useEffect, useState } from "react";
import { Tooltip, Chip } from "@nextui-org/react";
import axios from "axios";
import { tdClass, tdLastClass, tdNameClass, renderMoney } from "./tableHelpers";
import config from "../../../../../../utils/getToken";
import { API } from "../../../../../../utils/api";

const FilaPrincipal = ({
  colaborador,
  semana_id,
  handleColaboradorClick,
  isOpen,
}) => {
  const [totales, setTotales] = useState(null);

  useEffect(() => {
    const fetchTotales = () => {
      if (!semana_id || !colaborador?.id) return;
  
      const url = `${API}/totales-asistencia-administrativo/${semana_id}/${colaborador.id}`;
  
      axios
        .get(url, config)
        .then((res) => {
          if (res.data.totales?.id) {
            setTotales(res.data.totales);
          }
        })
        .catch((err) => console.error("Error cargando totales:", err));
    };

    fetchTotales();
  }, [semana_id, colaborador?.id, isOpen]);

  // --- VARIABLES DE INTERFAZ ---
  const esAdministrativo = colaborador?.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS";
  const nombreGrupo = colaborador?.cargo_laboral?.agrupacion_cargo || "-";
  const regimen = esAdministrativo ? "PLANILLA" : "LOCADOR";
  const chipBg = esAdministrativo ? "bg-purple-100 border-purple-200" : "bg-orange-100 border-orange-200";
  const chipText = esAdministrativo ? "text-purple-700" : "text-orange-700";

  // --- VARIABLES MATEMÁTICAS SEGURAS ---
  const salarioBruto = Number(totales?.salario_total || 0);
  const asigFamiliar = Number(colaborador?.asignacion_familiar || 0);
  
  // 1. Buscar el porcentaje de pensión que sea mayor a 0
  const pensionEncontrada = [
    colaborador?.afp_integra,
    colaborador?.afp_prima,
    colaborador?.afp_horizonte,
    colaborador?.afp_profuturo,
    colaborador?.afp_habitat,
    colaborador?.onp
  ].find(monto => Number(monto) > 0);
  
  const porcentajePension = Number(pensionEncontrada || 0);

  // 2. Calcular el monto en dinero (Salario Bruto * Porcentaje / 100)
  const montoPension = (salarioBruto * porcentajePension) / 100;

  const descuentos = 0; // Reserva por si necesitas agregar otros descuentos más adelante
  
  // 3. Fórmula final
  const totalPorPagar = salarioBruto + asigFamiliar - montoPension - descuentos;

  return (
    <tr className="hover:bg-blue-50/50 transition-colors group h-[38px]">
      <td className={tdClass}>{regimen}</td>

      <td className={tdClass}>
        <Chip
          size="sm"
          variant="flat"
          className="h-5 min-h-min"
          classNames={{
            base: chipBg,
            content: `font-bold text-[9px] px-2 ${chipText}`,
          }}
        >
          {nombreGrupo}
        </Chip>
      </td>

      <td className={tdNameClass}>
        <Tooltip
          content="Ver tareo de asistencias"
          placement="right"
          delay={300}
        >
          <span
            className="cursor-pointer text-slate-700 hover:text-amber-600 hover:underline transition-colors block w-full"
            onClick={() => handleColaboradorClick(colaborador.id)}
          >
            {colaborador?.apellidos_colaborador} {colaborador?.nombre_colaborador}
          </span>
        </Tooltip>
      </td>

      <td className={tdClass}>{colaborador?.dni_colaborador || "-"}</td>
      <td className={tdClass}>{colaborador?.bco || "-"}</td>
      <td className={tdClass}>{colaborador?.nro_cuenta || "-"}</td>

      <td className={tdClass}>{renderMoney(salarioBruto)}</td>
      <td className={tdClass}>{renderMoney(asigFamiliar)}</td>
      
      {/* Muestra el cálculo ya en dinero (ej. S/ 100.00) */}
      <td className={tdClass}>
        <Tooltip content={`${porcentajePension}% de pensión`} placement="top" delay={300}>
          <div className="w-full cursor-help">
            {renderMoney(montoPension)}
          </div>
        </Tooltip>
      </td>
      
      <td className={tdClass}>{renderMoney(descuentos)}</td>
      <td className={tdLastClass}>
        {renderMoney(totalPorPagar)}
      </td>
    </tr>
  );
};

export default FilaPrincipal;