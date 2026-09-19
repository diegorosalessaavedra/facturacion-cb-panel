import React, { useEffect, useState } from "react";
import { tdClass, tdLastClass, renderMoney } from "./tableHelpers";
import config from "../../../../../../utils/getToken";
import { API } from "../../../../../../utils/api";
import axios from "axios";

const TbodyAdicionales = ({ colaborador,semana_id }) => {
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
    <tr
      key={`side-${colaborador.id}`}
      className="hover:bg-blue-50/50 transition-colors group h-[38px]"
    >
      <td className={tdClass}>{renderMoney(totales?.adicionales_total || 0)}</td>
      <td className={tdLastClass}>{colaborador.telefono_colaborador || "-"}</td>
    </tr>
  );
};

export default TbodyAdicionales;