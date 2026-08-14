import React, { useState, useEffect, useRef } from "react";
import { Input } from "@nextui-org/react";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { toast } from "sonner";
import { onInputPrice } from "../../../../../../assets/onInputs";

const TrSaldoAnteriorAdmin = ({ colaborador, rowSpan, semanaPlanillaId }) => {
  // 1. Estado inicial estructurado
  const [saldoData, setSaldoData] = useState({
    id: null,
    semana_planilla_id: semanaPlanillaId || null,
    colaborador_id: colaborador?.id || null,
    salario: 0.0,
    adicionales: 0.0,
  });

  // Sincronización de la referencia para el guardado
  const datosRef = useRef(saldoData);
  useEffect(() => {
    datosRef.current = saldoData;
  }, [saldoData]);

  // 2. Función GET
  const handleSaldoAnterior = () => {
    if (!semanaPlanillaId || !colaborador?.id) return;

    // Asumimos que esta es tu ruta GET configurada en Express
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/saldo-anterior/${semanaPlanillaId}/${colaborador.id}`;

    axios
      .get(url, config)
      .then((res) => {
        // Asume que el backend devuelve un objeto "saldoAnterior"
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
        }
      })
      .catch((err) => console.error("Error al cargar saldo anterior:", err));
  };

  useEffect(() => {
    handleSaldoAnterior();
  }, []);

  // Función para manejar los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaldoData((prev) => {
      const updated = { ...prev, [name]: value };
      datosRef.current = updated;
      return updated;
    });
  };

  // 3. Función POST (Upsert)
  const handleSave = () => {
    const payload = {
      ...datosRef.current,
    };

    for (const key in payload) {
      if (payload[key] === "") payload[key] = null;
    }

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
      {/* CELDA AGRUPADORA (Nombre del trabajador) */}
      <td
        rowSpan={rowSpan}
        className="border-r border-slate-300 bg-blue-50/50 p-2 font-bold text-slate-800 uppercase text-[10px] whitespace-nowrap align-middle"
      >
        {colaborador?.apellidos_colaborador} <br />
        {colaborador?.nombre_colaborador}
      </td>

      {/* ESPACIOS VACÍOS HASTA SUBTOTALES */}
      <td
        colSpan={18}
        className="border-r border-b border-slate-200 text-right pr-4 font-bold text-red-600 text-[10px] uppercase"
      >
        Saldo Anterior
      </td>

      {/* INPUTS DE SALDO */}
      <td className="border-r border-b border-slate-200 p-1 min-w-[70px]">
        <Input
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
