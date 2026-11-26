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
  mes_id,
}) => {
  const [totales, setTotales] = useState(null);
  const [prestamos, setPrestamos] = useState([]);
  const [periodo5ta, setPeriodo5ta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!semana_id || !colaborador?.id || !mes_id) return;
    let isMounted = true;
    setLoading(true);

    const esAdmin =
      colaborador.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS";
    const endpointTotales = esAdmin
      ? `${API}/totales-asistencia-administrativo/${semana_id}/${colaborador.id}`
      : `${API}/totales-asistencia-operativo/${semana_id}/${colaborador.id}`;

    const urlPrestamos = `${API}/prestamos/${semana_id}/${colaborador.id}`;
    const urlPeriodo = `${API}/rrhh/periodos-5ta/${mes_id}/${colaborador.id}`;

    // Hacemos las 2 peticiones al mismo tiempo
    Promise.all([
      axios.get(endpointTotales, config).catch(() => ({ data: {} })),
      axios.get(urlPrestamos, config).catch(() => ({ data: {} })),
      axios.get(urlPeriodo, config).catch(() => ({ data: {} })),
    ]).then(([resTotales, resPrestamos, resPeriodo]) => {
      if (isMounted) {
        if (resTotales.data?.totales) {
          setTotales(resTotales.data.totales);
        }
        if (resPrestamos.data?.pago_encontrados) {
          setPrestamos(resPrestamos.data.pago_encontrados);
        }
        if (resPeriodo.data?.periodo) {
          setPeriodo5ta(resPeriodo.data.periodo);
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [semana_id, colaborador.id, mes_id, isOpen]);

  if (loading) {
    return (
      <tr>
        <td colSpan={10} className="h-[38px]"></td>
      </tr>
    );
  }

  switch (tipoTabla) {
    case "principal":
      return (
        <FilaPrincipal
          colaborador={colaborador}
          totales={totales}
          prestamos={prestamos}
          handleColaboradorClick={handleColaboradorClick}
          totalSemanas={totalSemanas}
          onTotalesCalculados={onTotalesCalculados}
          periodo5ta={periodo5ta}
          isFinalizado={isFinalizado}
        />
      );
    case "adicionales":
      return (
        <TbodyAdicionales
          colaborador={colaborador}
          totales={totales}
          isFinalizado={isFinalizado}
          onTotalesCalculados={onTotalesCalculados}
        />
      );
    case "validacion":
      return (
        <TbodyValidacion
          colaborador={colaborador}
          totales={totales}
          prestamos={prestamos}
          semana_id={semana_id}
          isFinalizado={isFinalizado}
          totalSemanas={totalSemanas}
          tardanza={totales?.descuento_tardanza}
          periodo5ta={periodo5ta}
          setSelectDatosText={setSelectDatosText}
        />
      );
    default:
      return null;
  }
};

export default FilaResumenColaborador;
