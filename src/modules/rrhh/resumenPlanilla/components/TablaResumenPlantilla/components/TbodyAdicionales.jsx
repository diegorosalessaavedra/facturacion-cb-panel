import React, { useEffect, useState, useRef } from "react";
import { Input } from "@nextui-org/react";
import { toast } from "sonner";
import { tdClass, tdLastClass, renderMoney } from "./tableHelpers";
import config from "../../../../../../utils/getToken";
import { API } from "../../../../../../utils/api";
import axios from "axios";
import { handleAxiosError } from "../../../../../../utils/handleAxiosError";

const TbodyAdicionales = ({ colaborador, semana_id, isOpen }) => {
  const [totales, setTotales] = useState(null);
  const [numeroDestino, setNumeroDestino] = useState("");

  // Referencia para saber cuál fue el último valor guardado y no hacer PATCH innecesarios
  const lastSavedValue = useRef("");

  const fetchTotales = () => {
    if (!semana_id || !colaborador?.id) return;

    const url = `${API}/totales-asistencia-administrativo/${semana_id}/${colaborador.id}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data.totales?.id) {
          setTotales(res.data.totales);

          // Si hay un número guardado lo usamos, si no, tomamos el del colaborador por defecto
          const initialPhone = res.data.totales.numero_destino;
          setNumeroDestino(initialPhone);
          lastSavedValue.current = initialPhone; // Guardamos registro del valor inicial
        }
      })
      .catch((err) => console.error("Error cargando totales:", err));
  };

  const patchTotales = () => {
    // 1. Evitar guardar si no hay ID de totales
    if (!totales?.id) {
      toast.error("No hay datos en el tareo");
      return;
    }

    // 2. Evitar peticiones HTTP si el número no ha cambiado
    if (numeroDestino === lastSavedValue.current) return;

    const url = `${API}/totales-asistencia-administrativo/${totales.id}`;

    // Enviamos 'numero_destino' (snake_case es el estándar de BD), 
    // pero también incluyo 'numeroDestino' por si tu backend lo lee en camelCase
    const payload = {
      numero_destino: numeroDestino,
      numeroDestino: numeroDestino
    };

    const toastId = toast.loading("Guardando número...");

    axios
      .patch(url, payload, config)
      .then(() => {
        toast.success("Número de destino actualizado", { id: toastId });
        lastSavedValue.current = numeroDestino; // Actualizamos el último valor guardado
      })
      .catch((err) => {
       handleAxiosError(err); 
      });
  };

  useEffect(() => {
    fetchTotales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semana_id, colaborador.id, isOpen]);

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
          type="text"
          placeholder="Sin número"
          value={numeroDestino}
          onChange={(e) => setNumeroDestino(e.target.value)}
          onBlur={patchTotales} // Se ejecuta al salir del input
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