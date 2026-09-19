import React, { useEffect, useState } from "react";
import { Tooltip, Chip } from "@nextui-org/react";
import axios from "axios";
import { tdClass, tdLastClass, tdNameClass, renderMoney } from "./tableHelpers";
import config from "../../../../../../utils/getToken";
import { API } from "../../../../../../utils/api";

const FilaPrincipal = ({ colaborador, semana_id, handleColaboradorClick }) => {
  // Declarar el estado que te faltaba
  const [totales, setTotales] = useState(null);

  const fetchTotales = () => {
    if (!semana_id || !colaborador?.id) return;
    
    const url = `${API}/totales-asistencia-administrativo/${semana_id}/${colaborador.id}`;

    axios
      .get(url, config) // Asegúrate de agregar 'config' aquí si lo necesitas: .get(url, config)
      .then((res) => {
        if (res.data.totales?.id) {
          setTotales(res.data.totales);
        }
      })
      .catch((err) => console.error("Error cargando totales:", err));
  };

  useEffect(() => {
    fetchTotales();
  
  }, [semana_id, colaborador.id]);

  console.log(totales);
  

  return (
    <tr className="hover:bg-blue-50/50 transition-colors group h-[38px]">
      <td className={tdClass}>
        {colaborador.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS" ? "PLANILLA" : "LOCADOR"}
      </td>

      <td className={tdClass}>
        <Chip
          size="sm"
          variant="flat"
          className="h-5 min-h-min"
          classNames={{
            base: colaborador.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS"
              ? "bg-purple-100 border-purple-200"
              : "bg-orange-100 border-orange-200",
            content: `font-bold text-[9px] px-2 ${colaborador.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS" ? "text-purple-700" : "text-orange-700"}`
          }}
        >
          {colaborador.cargo_laboral?.agrupacion_cargo || "-"}
        </Chip>
      </td>

      <td className={tdNameClass}>
        <Tooltip content="Ver tareo de asistencias" placement="right" delay={300}>
          <span
            className="cursor-pointer text-slate-700 hover:text-amber-600 hover:underline transition-colors block w-full"
            onClick={() => handleColaboradorClick(colaborador.id)}
          >
            {colaborador.apellidos_colaborador} {colaborador.nombre_colaborador}
          </span>
        </Tooltip>
      </td>

      <td className={tdClass}>{colaborador.dni_colaborador || "-"}</td>
      <td className={tdClass}>{colaborador.bco || "-"}</td>
      <td className={tdClass}>{colaborador.nro_cuenta || "-"}</td>

      {/* Aquí ya puedes usar la data que obtienes de la BD. Ejemplo: renderMoney(totales ? algo : 0) */}
      <td className={tdClass}>{renderMoney(totales?.salario_total || 0 )}</td>
      <td className={tdClass}>{renderMoney(0)}</td>
      <td className={tdClass}>{renderMoney(0)}</td>
      <td className={tdClass}>{renderMoney(0)}</td>
      <td className={tdLastClass}>{renderMoney(totales?.salario_total || 0 )}</td>
    </tr>
  );
};

export default FilaPrincipal;