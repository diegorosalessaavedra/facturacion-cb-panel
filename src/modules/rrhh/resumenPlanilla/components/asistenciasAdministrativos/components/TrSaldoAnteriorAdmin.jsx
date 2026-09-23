import React, { useState, useEffect, useRef } from "react";
import { Input } from "@nextui-org/react";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { toast } from "sonner";
import { onInputPrice } from "../../../../../../assets/onInputs";

// 1. Agregamos onDataUpdate a las props
const TrSaldoAnteriorAdmin = ({
  colaborador,
  rowSpan,
  semanaPlanillaId,
  onDataUpdate,
  isFinalizado,
}) => {
  const [saldoData, setSaldoData] = useState({
    id: null,
    semana_planilla_id: semanaPlanillaId || null,
    colaborador_id: colaborador?.id || null,
    salario: 0.0,
    adicionales: 0.0,
  });

  const datosRef = useRef(saldoData);
  useEffect(() => {
    datosRef.current = saldoData;
  }, [saldoData]);

  const handleSaldoAnterior = () => {
    if (!semanaPlanillaId || !colaborador?.id) return;

    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/saldo-anterior/${semanaPlanillaId}/${colaborador.id}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data.saldoAnterior) {
          const data = res.data.saldoAnterior;
          const newData = {
            id: data.id,
            semana_planilla_id: data.semana_planilla_id,
            colaborador_id: data.colaborador_id,
            salario: data.salario,
            adicionales: data.adicionales,
          };
          setSaldoData(newData);
          // 2. Avisamos al padre con los datos recibidos de la BD
          if (onDataUpdate) onDataUpdate(newData);
        } else {
          // Si no hay datos previos, mandamos el estado inicial en 0
          if (onDataUpdate) onDataUpdate(saldoData);
        }
      })
      .catch((err) => console.error("Error al cargar saldo anterior:", err));
  };

  useEffect(() => {
    handleSaldoAnterior();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaldoData((prev) => {
      const updated = { ...prev, [name]: value };
      datosRef.current = updated;
      // 3. Avisamos al padre mientras el usuario tipea
      if (onDataUpdate) onDataUpdate(updated);
      return updated;
    });
  };

  const handleSave = () => {
    const payload = {
      ...datosRef.current,
    };

    for (const key in payload) {
      if (payload[key] === "") payload[key] = null;
    }

    // 4. CORRECCIÓN DEL ERROR PREVIO: Declaramos toastId aquí dentro
    const toastId = toast.loading("Guardando saldo...");

    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/saldo-anterior/${payload.id || "0"}`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Saldo anterior guardado", { id: toastId });

        if (res.data?.data?.id) {
          const newId = res.data.data.id;
          setSaldoData((prev) => {
            const updated = { ...prev, id: newId };
            datosRef.current = updated;
            return updated;
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al guardar saldo anterior", { id: toastId });
      });
  };

  const inputUIClasses = {
    inputWrapper:
      "min-h-[25px] h-[25px] px-1 bg-white shadow-none hover:bg-slate-50 transition-colors",
    input: "text-[10px] text-center font-bold text-red-600",
  };

  return (
    <tr className="bg-slate-100 transition-colors">
      <td
        rowSpan={rowSpan}
        className="border-r border-slate-300 bg-blue-50/50 p-2 font-bold text-slate-800 uppercase text-[10px] whitespace-nowrap align-middle"
      >
        {colaborador?.apellidos_colaborador} <br />
        {colaborador?.nombre_colaborador}
      </td>

      <td
        colSpan={18}
        className="border-r border-b border-slate-200 text-right pr-4 font-bold text-red-600 text-[10px] uppercase"
      >
        Saldo Anterior
      </td>

      <td className="border-r border-b border-slate-200 p-1 min-w-[70px]">
        <Input
          isDisabled={isFinalizado}
          type="text"
          onInput={onInputPrice}
          name="salario"
          value={saldoData.salario || ""}
          onChange={handleChange}
          onBlur={handleSave}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          startContent={<span className="text-[9px] text-red-500">S/</span>}
        />
      </td>
      <td className="border-b border-slate-200 p-1 min-w-[70px]">
        <Input
          isDisabled={isFinalizado}
          type="text"
          onInput={onInputPrice}
          name="adicionales"
          value={saldoData.adicionales || ""}
          onChange={handleChange}
          onBlur={handleSave}
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
