import React, { useEffect, useState, useRef } from "react";
import { Input } from "@nextui-org/react";
import { toast } from "sonner";
import { tdClass, tdLastClass, renderMoney } from "./tableHelpers";
import config from "../../../../../../utils/getToken";
import { API } from "../../../../../../utils/api";
import axios from "axios";
import { handleAxiosError } from "../../../../../../utils/handleAxiosError";

const TbodyAdicionales = ({
  colaborador,
  totales,
  isFinalizado,
  onTotalesCalculados,
}) => {
  const [numeroDestino, setNumeroDestino] = useState("");

  const lastSavedValue = useRef("");

  // Constante auxiliar para saber si es administrativo u operativo
  const esAdministrativo =
    colaborador?.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS";

  const patchTotales = () => {
    if (!totales?.id) {
      toast.error("No hay datos en el tareo");
      return;
    }

    if (numeroDestino === lastSavedValue.current) return;

    // Dinámico: hace el parcheo en la ruta correcta
    const endpoint = esAdministrativo
      ? "totales-asistencia-administrativo"
      : "totales-asistencia-operativo";

    const url = `${API}/${endpoint}/${totales.id}`;

    const payload = {
      numero_destino: numeroDestino,
    };

    const toastId = toast.loading("Guardando número...");

    axios
      .patch(url, payload, config)
      .then(() => {
        toast.success("Número de destino actualizado", { id: toastId });
        lastSavedValue.current = numeroDestino;
      })
      .catch((err) => {
        handleAxiosError(err);
      });
  };

  useEffect(() => {
    if (onTotalesCalculados) {
      onTotalesCalculados(colaborador.id, {
        // Aseguramos que sea número para evitar concatenación de strings en el Gran Total
        adicionales: Number(totales?.adicionales_total || 0),
      });
    }
  }, [totales?.adicionales_total, colaborador.id]);

  return (
    <tr
      key={`side-${colaborador.id}`}
      className="hover:bg-blue-50/50 transition-colors group h-[38px]"
    >
      <td className={tdClass}>
        {renderMoney(totales?.adicionales_total || 0)}
      </td>
      <td className={`${tdLastClass} p-1`}>
        <Input
          isDisabled={isFinalizado}
          type="text"
          placeholder="0"
          value={numeroDestino}
          onChange={(e) => setNumeroDestino(e.target.value)}
          onBlur={patchTotales}
          size="sm"
          classNames={{
            inputWrapper:
              "min-h-[25px] h-[25px] px-2 bg-transparent shadow-none hover:bg-slate-100 data-[focus=true]:bg-white data-[focus=true]:shadow-sm data-[focus=true]:border-slate-300 transition-all border border-transparent rounded-md",
            input: "text-[10px] text-center text-slate-700 font-semibold",
          }}
        />
      </td>
    </tr>
  );
};

export default TbodyAdicionales;
