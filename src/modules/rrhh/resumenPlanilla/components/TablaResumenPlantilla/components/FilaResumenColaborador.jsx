import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { API } from "../../../../../../utils/api";

import FilaPrincipal from "./FilaPrincipal";
import TbodyAdicionales from "./TbodyAdicionales";
import TbodyValidacion from "./TbodyValidacion";

const FilaResumenColaborador = ({
  tipoTabla,
  colaborador,
  semana_id,
  handleColaboradorClick,
  isOpen,
  totalSemanas,
  onTotalesCalculados,
  isFinalizado,
  setSelectDatosText,
}) => {
  const [totales, setTotales] = useState(null);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!semana_id || !colaborador?.id) return;
    let isMounted = true;
    setLoading(true);

    const esAdmin =
      colaborador.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS";
    const endpointTotales = esAdmin
      ? `${API}/totales-asistencia-administrativo/${semana_id}/${colaborador.id}`
      : `${API}/totales-asistencia-operativo/${semana_id}/${colaborador.id}`;

    const urlPrestamos = `${API}/prestamos/${semana_id}/${colaborador.id}`;

    // Hacemos las 2 peticiones al mismo tiempo
    Promise.all([
      axios.get(endpointTotales, config).catch(() => ({ data: {} })),
      axios.get(urlPrestamos, config).catch(() => ({ data: {} })),
    ]).then(([resTotales, resPrestamos]) => {
      if (isMounted) {
        if (resTotales.data?.totales) {
          setTotales(resTotales.data.totales);
        }
        if (resPrestamos.data?.pago_encontrados) {
          setPrestamos(resPrestamos.data.pago_encontrados);
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [semana_id, colaborador.id, isOpen]);

  // Si aún está cargando, puedes mostrar una fila vacía o un esqueleto para no romper el layout
  if (loading) {
    return (
      <tr>
        <td colSpan={10} className="h-[38px]"></td>
      </tr>
    );
  }

  // Renderiza el componente hijo correspondiente y le inyecta "totales" y "prestamos" ya cargados
  switch (tipoTabla) {
    case "principal":
      return (
        <FilaPrincipal
          colaborador={colaborador}
          totales={totales} // <--- Prop inyectada
          prestamos={prestamos} // <--- Prop inyectada
          handleColaboradorClick={handleColaboradorClick}
          totalSemanas={totalSemanas}
          onTotalesCalculados={onTotalesCalculados}
        />
      );
    case "adicionales":
      return (
        <TbodyAdicionales
          colaborador={colaborador}
          totales={totales} // <--- Prop inyectada
          isFinalizado={isFinalizado}
          onTotalesCalculados={onTotalesCalculados}
        />
      );
    case "validacion":
      return (
        <TbodyValidacion
          colaborador={colaborador}
          totales={totales} // <--- Prop inyectada
          prestamos={prestamos} // <--- Prop inyectada
          semana_id={semana_id}
          isFinalizado={isFinalizado}
          totalSemanas={totalSemanas}
          setSelectDatosText={setSelectDatosText}
        />
      );
    default:
      return null;
  }
};

export default FilaResumenColaborador;
