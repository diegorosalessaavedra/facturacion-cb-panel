import React, { useState, useEffect, useRef } from "react";
import { Input } from "@nextui-org/react";
import { formatDateES } from "../../../../../../utils/formatDateTime";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { toast } from "sonner";

const TrDominicalAdmin = ({
  saldoAnteriorId,
  colaborador_id,
  diaDomingo,
  sueldoPorDia,
  onDataUpdate, // <--- 1. Recibir nueva prop
}) => {
  const [dominicalData, setDominicalData] = useState({
    id: null,
    colaborador_id: colaborador_id,
    dia_planilla_id: diaDomingo?.id || null,
    turnos: 0,
    total_planilla: sueldoPorDia || 0.0,
    salario: sueldoPorDia || 0.0,
    adicionales: 0.0,
  });

  const datosRef = useRef(dominicalData);
  useEffect(() => {
    datosRef.current = dominicalData;
  }, [dominicalData]);

  const handleDominical = () => {
    if (!diaDomingo?.id || !colaborador_id) return;
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/dominical/${diaDomingo.id}/${colaborador_id}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data.dominical) {
          const data = res.data.dominical;
          const newData = {
            id: data.id,
            colaborador_id: data.colaborador_id,
            dia_planilla_id: data.dia_planilla_id,
            turnos: data.turnos,
            total_planilla: sueldoPorDia,
            salario: data.salario,
            adicionales: data.adicionales,
          };
          setDominicalData(newData);
          if (onDataUpdate) onDataUpdate(newData); // <--- 2. Avisar al padre en el GET
        } else {
          // Si no hay datos, de todos modos enviamos el default (turno 0) al padre
          if (onDataUpdate) onDataUpdate(dominicalData);
        }
      })
      .catch((err) => console.error("Error al cargar dominical:", err));
  };

  useEffect(() => {
    handleDominical();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDominicalData((prev) => {
      const updated = { ...prev, [name]: value };
      datosRef.current = updated;
      if (onDataUpdate) onDataUpdate(updated); // <--- 3. Avisar al padre al escribir
      return updated;
    });
  };

  const handleSave = () => {
    const payload = {
      ...datosRef.current,
      total_planilla: sueldoPorDia,
    };

    for (const key in payload) {
      if (payload[key] === "") payload[key] = null;
    }

    const toastId = toast.loading("Guardando dominical...");
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/dominical/${payload.id || "0"}`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Dominical guardado", { id: toastId });
        if (res.data?.data?.id) {
          const newId = res.data.data.id;
          setDominicalData((prev) => {
            const updated = { ...prev, id: newId };
            datosRef.current = updated;
            return updated;
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al guardar dominical", { id: toastId });
      });
  };

  // ... (Tus estilos siguen igual) ...
  const inputUIClasses = {
    inputWrapper:
      "min-h-[25px] h-[25px] px-1 bg-white shadow-none hover:bg-white/70 data-[focus=true]:bg-white data-[focus=true]:shadow-sm transition-all",
    input: "text-[10px] text-center text-slate-700 font-medium",
  };
  const readOnlyTextClass =
    "min-h-[25px] h-[25px] w-full flex items-center justify-center text-[10px] text-slate-700 font-bold px-1";

  return (
    <tr className="bg-blue-50/40 hover:bg-blue-50/60 transition-colors group">
      <td
        colSpan={11}
        className="border-r border-b border-blue-200 text-center font-bold text-slate-700 text-[10px] uppercase"
      >
        DOMINICAL {diaDomingo ? formatDateES(diaDomingo.dia_plantilla) : ""}
      </td>
      <td className="border-r border-b border-blue-200 p-1">
        <Input
          type="number"
          step="0.01"
          name="turnos"
          value={dominicalData.turnos || ""}
          onChange={handleChange}
          onBlur={handleSave}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
        />
      </td>
      <td className="border-r border-b border-teal-200 p-1 bg-teal-50/40">
        <div className={readOnlyTextClass}>{sueldoPorDia ?? "0.00"}</div>
      </td>
      <td
        colSpan={5}
        className="border-r border-b border-teal-200 bg-teal-50/40"
      ></td>
      <td className="border-r border-b border-amber-200 p-1 bg-amber-50/40">
        <Input
          type="number"
          step="0.01"
          name="salario"
          value={dominicalData.salario || ""}
          onChange={handleChange}
          onBlur={handleSave}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
        />
      </td>
      <td className="border-b border-amber-200 p-1 bg-amber-50/40">
        <Input
          type="number"
          step="0.01"
          name="adicionales"
          value={dominicalData.adicionales || ""}
          onChange={handleChange}
          onBlur={handleSave}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
        />
      </td>
    </tr>
  );
};

export default TrDominicalAdmin;
