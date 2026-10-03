import React, { useState, useEffect, useRef } from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { formatDateES } from "../../../../../../../utils/formatDateTime";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import { toast } from "sonner";
import {
  onInputNumber,
  onInputPrice,
} from "../../../../../../../assets/onInputs";
import { handleAxiosError } from "../../../../../../../utils/handleAxiosError";

// --- FUNCIÓN HELPER PARA FORMATEAR DATETIME-LOCAL ---
// Convierte un string o Date de la base de datos al formato "YYYY-MM-DDTHH:mm"
const formatForDateTimeLocal = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // Si no es una fecha válida, retorna como está

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const TrAsistenciaOperativo = ({
  dia,
  findColaborador,
  sueldoPorDia,
  sueldoFeriadoBruto,
  onDataUpdate,
  isFinalizado,
}) => {
  const esFeriado = Boolean(dia?.bonificacion_feriado);
  const valorAsistenciaFeriado = esFeriado ? "SI" : "NO";
  const valorMontoFeriado = esFeriado ? sueldoFeriadoBruto || 0.0 : 0.0;

  const aplicarReglasTurno = (datos) => {
    const cantTurnos = Number(datos.turnos || 0);
    const trabajo = cantTurnos > 0;
    const valorBono = Number(datos.bono || 0);
    const valorImpHoras = Number(datos.importe_horas || 0);
    const valorImpMinutos = Number(datos.importe_minutos || 0);
    const basePlanilla = sueldoPorDia * cantTurnos;

    return {
      ...datos,
      total_planilla: trabajo ? basePlanilla : 0,
      asistencia_feriado: valorAsistenciaFeriado,
      feriados: trabajo ? valorMontoFeriado : 0,
      salario: trabajo ? basePlanilla + valorImpHoras + valorImpMinutos : 0,
      adicionales: trabajo ? Number(valorMontoFeriado) + valorBono : 0,
    };
  };

  const [datosAsistencia, setDatosAsistencia] = useState(() =>
    aplicarReglasTurno({
      id: null,
      dia_planilla_id: dia?.id || null,
      semana_planilla_id:
        dia?.semana_plantilla_id || dia?.semana_planilla_id || null,
      colaborador_id: findColaborador?.id || null,
      asistencia_feriado: valorAsistenciaFeriado,
      turno: "DIURNO",
      actividad_dia: "",
      entrada: "",
      salida: "",
      total_horas_minutos: "",
      horas_enteras: "",
      minutos_enteros: "",
      turnos: 0,
      total_planilla: 0,
      hr_min_extra: "",
      importe_horas: 0.0,
      importe_minutos: 0.0,
      bono: 0.0,
      feriados: 0.0,
      salario: 0.0,
      adicionales: 0.0,
      estado: "PENDIENTE DE ENVIAR",
    }),
  );

  const datosRef = useRef(datosAsistencia);
  useEffect(() => {
    datosRef.current = datosAsistencia;
  }, [datosAsistencia]);

  const saveSeqRef = useRef(0);

  const handleAsistencia = () => {
    if (!dia?.id || !findColaborador?.id) return;
    const url = `${import.meta.env.VITE_URL_API}/asistencia-operativo/${dia.id}/${findColaborador.id}`;
    axios
      .get(url, config)
      .then((res) => {
        if (res.data.asistencia) {
          const { calculo_asistencia_operativo, ...datosPrincipales } =
            res.data.asistencia;
          const {
            id: idCalculo,
            asistencia_operativo_id,
            ...datosCalculoLimpio
          } = calculo_asistencia_operativo || {};

          const newData = aplicarReglasTurno({
            ...datosAsistencia,
            ...datosPrincipales,
            ...datosCalculoLimpio,
          });

          setDatosAsistencia(newData);
          if (onDataUpdate) onDataUpdate(newData);
        } else {
          if (onDataUpdate) onDataUpdate(datosAsistencia);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    handleAsistencia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosAsistencia((prev) => {
      const updated = aplicarReglasTurno({ ...prev, [name]: value });
      datosRef.current = updated;
      if (onDataUpdate) onDataUpdate(updated);
      return updated;
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (!value) return;
    const nuevosDatos = aplicarReglasTurno({
      ...datosAsistencia,
      [name]: value,
    });
    datosRef.current = nuevosDatos;
    setDatosAsistencia(nuevosDatos);
    if (onDataUpdate) onDataUpdate(nuevosDatos);
    handleSave(nuevosDatos);
  };

  const handleSave = (datosAEnviar = datosRef.current) => {
    const payload = { ...datosAEnviar };
    delete payload.huellero_entrada;
    delete payload.huellero_salida;

    for (const key in payload) {
      if (payload[key] === "") payload[key] = null;
    }
    const mySeq = ++saveSeqRef.current;
    const toastId = toast.loading("Guardando...");
    const url = `${import.meta.env.VITE_URL_API}/asistencia-operativo/${
      payload.id || "0"
    }`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Guardado", { id: toastId });
        const newId = res.data?.data?.id ?? payload.id;
        if (mySeq !== saveSeqRef.current) return;
        if (newId && newId !== datosRef.current.id) {
          setDatosAsistencia((prev) => {
            const updated = { ...prev, id: newId };
            datosRef.current = updated;
            return updated;
          });
        }
      })
      .catch(handleAxiosError);
  };

  const inputUIClasses = {
    inputWrapper:
      "min-h-[25px] h-[25px] px-1 bg-white shadow-sm border border-slate-200 hover:bg-white/90 data-[focus=true]:bg-white data-[focus=true]:shadow-md transition-all",
    input: "text-[10px] text-center text-slate-700 font-medium",
  };
  const selectUIClasses = {
    trigger:
      "min-h-[25px] h-[25px] px-1 bg-white shadow-sm border border-slate-200 hover:bg-white/90 data-[open=true]:bg-white data-[open=true]:shadow-md transition-all",
    value: "text-[10px] text-center text-slate-700 font-medium",
  };
  const readOnlyTextClass =
    "min-h-[25px] h-[25px] w-full flex items-center justify-center text-[10px] text-slate-600 font-bold rounded-sm px-1";

  const tdBlue = "border-r border-b border-blue-200 bg-blue-50/80 p-1";
  const tdGreen = "border-r border-b border-teal-200 bg-teal-50/80 p-1";
  const tdYellow = "border-r border-b border-amber-200 bg-amber-50/80 p-1";
  const tdYellowLast = "border-b border-amber-200 bg-amber-50/80 p-1";

  const {
    asistencia_feriado,
    turno,
    actividad_dia,
    entrada,
    salida,
    total_horas_minutos,
    horas_enteras,
    minutos_enteros,
    turnos,
    total_planilla,
    hr_min_extra,
    importe_horas,
    importe_minutos,
    bono,
    feriados,
    salario,
    adicionales,
  } = datosAsistencia;

  const opcionesSiNo = [
    { key: "NO", label: "NO" },
    { key: "SI", label: "SI" },
  ];
  const opcionesTurno = [
    { key: "DIURNO", label: "DIURNO" },
    { key: "NOCTURNO", label: "NOCTURNO" },
    { key: "NOCTURNO ALTO", label: "NOCTURNO ALTO" },
    { key: "VIAJES", label: "VIAJES" },
  ];

  return (
    <>
      <tr className="group hover:bg-slate-50 transition-colors">
        <td
          className={`${tdBlue} uppercase text-[9px] whitespace-nowrap align-middle min-w-[180px]`}
        >
          {formatDateES(dia?.dia_plantilla) || "-"}
        </td>
        <td className={`${tdBlue} min-w-[70px]`}>
          <div className={readOnlyTextClass}>{asistencia_feriado}</div>
        </td>

        <td className={`${tdBlue} min-w-[100px]`}>
          <Select
            isDisabled={isFinalizado}
            aria-label="Turno"
            name="turno"
            selectedKeys={new Set([turno])}
            onChange={handleSelectChange}
            size="sm"
            classNames={selectUIClasses}
          >
            {opcionesTurno.map((op) => (
              <SelectItem key={op.key} textValue={op.label}>
                <p className="text-[9px]">{op.label}</p>
              </SelectItem>
            ))}
          </Select>
        </td>
        <td className={`${tdBlue} min-w-[120px]`}>
          <Input
            isDisabled={isFinalizado}
            aria-label="Actividad del día"
            type="text"
            name="actividad_dia"
            value={actividad_dia || ""}
            onChange={handleChange}
            onBlur={() => handleSave()}
            placeholder="..."
            size="sm"
            classNames={inputUIClasses}
          />
        </td>

        {/* Celda Hora y Fecha Entrada */}
        <td className={`${tdBlue} min-w-[140px]`}>
          <Input
            isDisabled={isFinalizado}
            aria-label="Entrada"
            type="datetime-local"
            name="entrada"
            value={formatForDateTimeLocal(entrada)}
            onChange={handleChange}
            onBlur={() => handleSave()}
            size="sm"
            classNames={inputUIClasses}
          />
        </td>

        {/* Celda Hora y Fecha Salida */}
        <td className={`${tdBlue} min-w-[140px]`}>
          <Input
            isDisabled={isFinalizado}
            aria-label="Salida"
            type="datetime-local"
            name="salida"
            value={formatForDateTimeLocal(salida)}
            onChange={handleChange}
            onBlur={() => handleSave()}
            size="sm"
            classNames={inputUIClasses}
          />
        </td>

        <td className={`${tdBlue} min-w-[80px]`}>
          <div className={readOnlyTextClass}>{total_horas_minutos || "-"}</div>
        </td>
        <td className={`${tdBlue} min-w-[60px]`}>
          <div className={readOnlyTextClass}>{horas_enteras || "0"}</div>
        </td>
        <td className={`${tdBlue} min-w-[60px]`}>
          <div className={readOnlyTextClass}>{minutos_enteros || "0"}</div>
        </td>
        <td className={`${tdGreen} min-w-[60px]`}>
          <Input
            isDisabled={isFinalizado}
            aria-label="Turnos"
            type="text"
            onInput={onInputNumber}
            name="turnos"
            value={turnos || ""}
            onChange={handleChange}
            onBlur={() => handleSave()}
            size="sm"
            classNames={inputUIClasses}
          />
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <div className={readOnlyTextClass}>
            {Number(total_planilla || 0).toFixed(2)}
          </div>
        </td>
        <td className={`${tdGreen} min-w-[80px]`}>
          <div
            className={`${readOnlyTextClass} bg-white border border-slate-200 shadow-sm`}
          >
            {hr_min_extra || "-"}
          </div>
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <div
            className={`${readOnlyTextClass} bg-white border border-slate-200 shadow-sm`}
          >
            {Number(importe_horas || 0).toFixed(2)}
          </div>
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <div
            className={`${readOnlyTextClass} bg-white border border-slate-200 shadow-sm`}
          >
            {Number(importe_minutos || 0).toFixed(2)}
          </div>
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <Input
            isDisabled={isFinalizado}
            aria-label="Bono"
            type="text"
            onInput={onInputPrice}
            name="bono"
            value={bono || ""}
            onChange={handleChange}
            onBlur={() => handleSave()}
            size="sm"
            classNames={inputUIClasses}
          />
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <div className={readOnlyTextClass}>
            {Number(feriados || 0).toFixed(2)}
          </div>
        </td>
        <td className={`${tdYellow} min-w-[70px]`}>
          <div className={readOnlyTextClass}>
            {Number(salario || 0).toFixed(2)}
          </div>
        </td>
        <td className={`${tdYellowLast} min-w-[70px]`}>
          <div className={readOnlyTextClass}>
            {Number(adicionales || 0).toFixed(2)}
          </div>
        </td>
      </tr>
    </>
  );
};

export default TrAsistenciaOperativo;
