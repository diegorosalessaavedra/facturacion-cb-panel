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

const formatForDateTimeLocal = (dateStr) => {
  if (!dateStr) return "";
  if (typeof dateStr === "string") {
    const normalized = dateStr.replace(" ", "T");
    if (normalized.includes("T")) {
      return normalized.substring(0, 16);
    }
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const TrAsistenciaOperativo = ({
  dia,
  findColaborador,
  sueldoPorDia,
  valorHora,
  sueldoFeriadoBruto,
  onDataUpdate,
  isFinalizado,
  bono_extraordinario,
}) => {
  const esFeriado = Boolean(dia?.bonificacion_feriado);

  const aplicarReglasTurno = (datos) => {
    // --- NUEVA REGLA: SELECCIÓN DE FERIADO ---
    let finalAsistenciaFeriado = "NO";
    if (esFeriado) {
      // Si es feriado, tomamos lo que el usuario haya seleccionado, por defecto "SI"
      finalAsistenciaFeriado = datos.asistencia_feriado || "SI";
    }

    // --- REGLA: AUTOMATIZACIÓN DEL BONO BASE ---
    let valorBonoBase = Number(datos.bono || 0);

    if (datos.turno === "NOCTURNO ATO" || datos.turno === "VIAJES") {
      valorBonoBase = Number(bono_extraordinario || 0);
    } else {
      if (
        valorBonoBase === Number(bono_extraordinario || 0) &&
        Number(bono_extraordinario || 0) !== 0
      ) {
        valorBonoBase = 0;
      }
    }

    const vHora = Number(valorHora || 0);
    const vMinuto = vHora / 60;

    // --- 1. LÓGICA DE CÁLCULO DE HORAS ---
    let valTotalHoras = datos.total_horas_minutos || "";
    let valHoras = datos.horas_enteras || "0";
    let valMinutos = datos.minutos_enteros || "0";

    const safeParseDate = (val) => {
      if (!val) return null;
      let d = new Date(val);
      if (!isNaN(d.getTime())) return d;

      if (typeof val === "string" && val.includes(":")) {
        const hoy = new Date().toISOString().split("T")[0];
        d = new Date(`${hoy}T${val.substring(0, 5)}`);
        if (!isNaN(d.getTime())) return d;
      }
      return null;
    };

    const dEntrada = safeParseDate(datos.entrada);
    const dSalida = safeParseDate(datos.salida);

    let h = Number(valHoras);
    let m = Number(valMinutos);

    if (dEntrada && dSalida) {
      let diffMs = dSalida - dEntrada;

      if (
        diffMs < 0 &&
        typeof datos.entrada === "string" &&
        datos.entrada.length <= 8
      ) {
        diffMs += 24 * 60 * 60 * 1000;
      }

      if (diffMs >= 0) {
        const totalMinutosTotales = Math.floor(diffMs / 60000);
        h = Math.floor(totalMinutosTotales / 60);
        m = totalMinutosTotales % 60;

        valHoras = h.toString();
        valMinutos = m.toString();
        valTotalHoras = `${h}:${m.toString().padStart(2, "0")}`;
      } else {
        h = 0;
        m = 0;
        valHoras = "0";
        valMinutos = "0";
        valTotalHoras = "0:00";
      }
    }

    // --- 2. LÓGICA DE TURNOS Y HORAS EXTRAS SEGÚN REGLAS ---
    let turnosCalculados = 0;
    let horasExtrasEnteras = 0;
    let minutosExtras = 0;

    if (h >= 6 && h <= 12) {
      turnosCalculados = 1;
    } else if (h > 12 && h < 18) {
      turnosCalculados = 1;
      horasExtrasEnteras = h - 12;
      minutosExtras = m;
    } else if (h >= 18 && h < 24) {
      turnosCalculados = 2;
    } else if (h >= 24 && h < 30) {
      turnosCalculados = 2;
      horasExtrasEnteras = h - 24;
      minutosExtras = m;
    } else if (h >= 30 && h < 36) {
      turnosCalculados = 3;
    } else if (h >= 36 && h < 42) {
      turnosCalculados = 3;
      horasExtrasEnteras = h - 36;
      minutosExtras = m;
    } else if (h >= 42 && h < 48) {
      turnosCalculados = 4;
    } else if (h >= 48 && h < 54) {
      turnosCalculados = 4;
      horasExtrasEnteras = h - 48;
      minutosExtras = m;
    } else if (h >= 54 && h < 60) {
      turnosCalculados = 5;
    } else if (h >= 60) {
      turnosCalculados = 5;
      horasExtrasEnteras = h - 60;
      minutosExtras = m;
      if (horasExtrasEnteras > 5) {
        horasExtrasEnteras = 5;
        minutosExtras = 0;
      }
    }

    const turnosFinal =
      dEntrada && dSalida ? turnosCalculados : Number(datos.turnos || 0);

    const textoHrsExtraCalculado =
      horasExtrasEnteras > 0 || minutosExtras > 0
        ? `${horasExtrasEnteras.toString().padStart(2, "0")}:${minutosExtras.toString().padStart(2, "0")}`
        : "";

    const hrMinExtraStr =
      dEntrada && dSalida ? textoHrsExtraCalculado : datos.hr_min_extra || "";

    // --- NUEVO: CÁLCULO DEL BONO TOTAL MULTIPLICADO POR TURNOS ---
    const valorBonoTotal = valorBonoBase * turnosFinal;

    // --- 3. LÓGICA FINANCIERA ACTUALIZADA ---
    const trabajo = turnosFinal > 0;
    const basePlanilla = sueldoPorDia * turnosFinal;

    const calculoImporteHoras = horasExtrasEnteras * vHora;
    const calculoImporteMinutos = minutosExtras >= 40 ? vHora : 0;

    const valorImpHoras =
      dEntrada && dSalida
        ? calculoImporteHoras
        : Number(datos.importe_horas || 0);

    const valorImpMinutos =
      dEntrada && dSalida
        ? calculoImporteMinutos
        : Number(datos.importe_minutos || 0);

    // NUEVO: Validación de importe de feriados según el Select (SI / NO)
    let valorFeriados = datos.feriados;
    if (finalAsistenciaFeriado === "NO") {
      valorFeriados = 0; // Si se elige NO o no es feriado, el valor es 0
    } else if (
      valorFeriados === undefined ||
      valorFeriados === null ||
      valorFeriados === ""
    ) {
      valorFeriados = trabajo ? Number(sueldoFeriadoBruto || 0) : 0;
    }

    // Sumamos Importe Horas, Minutos, Feriados y Bono Total únicamente a los Adicionales
    const calculoAdicionales = trabajo
      ? Number(valorFeriados) + valorBonoTotal + valorImpHoras + valorImpMinutos
      : 0;

    return {
      ...datos,
      asistencia_feriado: finalAsistenciaFeriado, // Guardamos la selección
      bono: valorBonoTotal > 0 ? valorBonoTotal.toFixed(2) : "", // Asignamos el bono total calculado
      total_horas_minutos: valTotalHoras,
      horas_enteras: valHoras,
      minutos_enteros: valMinutos,
      turnos: turnosFinal.toString(),
      hr_min_extra: hrMinExtraStr,
      importe_horas: valorImpHoras ? valorImpHoras.toFixed(2) : "0.00",
      importe_minutos: valorImpMinutos ? valorImpMinutos.toFixed(2) : "0.00",
      total_planilla: trabajo ? basePlanilla : 0,
      feriados: valorFeriados,
      salario: trabajo ? basePlanilla : 0,
      adicionales: calculoAdicionales,
    };
  };

  const [datosAsistencia, setDatosAsistencia] = useState(() =>
    aplicarReglasTurno({
      id: null,
      dia_planilla_id: dia?.id || null,
      semana_planilla_id:
        dia?.semana_plantilla_id || dia?.semana_planilla_id || null,
      colaborador_id: findColaborador?.id || null,
      asistencia_feriado: esFeriado ? "SI" : "NO", // Valor por defecto
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
      importe_horas: "0.00",
      importe_minutos: "0.00",
      bono: 0.0,
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

  const opcionesTurno = [
    { key: "DIURNO", label: "DIURNO" },
    { key: "NOCTURNO", label: "NOCTURNO" },
    { key: "NOCTURNO ATO", label: "NOCTURNO ATO" },
    { key: "VIAJES", label: "VIAJES" },
  ];

  const opcionesFeriado = [
    { key: "NO", label: "NO" },
    { key: "SI", label: "SI" },
  ];

  return (
    <>
      <tr className="group hover:bg-slate-50 transition-colors">
        <td
          className={`${tdBlue} uppercase text-[9px] whitespace-nowrap align-middle min-w-[180px]`}
        >
          {formatDateES(dia?.dia_plantilla) || "-"}
        </td>

        {/* NUEVO: Celda de Feriado transformada en Select */}
        <td className={`${tdBlue} min-w-[70px]`}>
          <Select
            isDisabled={isFinalizado || !esFeriado} // Se bloquea si no es un día feriado real
            aria-label="Asistencia Feriado"
            name="asistencia_feriado"
            selectedKeys={new Set([asistencia_feriado])}
            onChange={handleSelectChange}
            size="sm"
            classNames={selectUIClasses}
          >
            {/* Si no es feriado, solo muestra "NO". Si lo es, muestra "SI" y "NO" */}
            {(!esFeriado ? [{ key: "NO", label: "NO" }] : opcionesFeriado).map(
              (op) => (
                <SelectItem key={op.key} textValue={op.label}>
                  <p className="text-[9px] font-bold">{op.label}</p>
                </SelectItem>
              ),
            )}
          </Select>
        </td>

        <td className={`${tdBlue} min-w-[150px]`}>
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
            S/ {Number(total_planilla || 0).toFixed(2)}
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
            S/ {importe_horas === "0.00" ? "-" : importe_horas}
          </div>
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <div
            className={`${readOnlyTextClass} bg-white border border-slate-200 shadow-sm`}
          >
            S/ {importe_minutos === "0.00" ? "-" : importe_minutos}
          </div>
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <div className={readOnlyTextClass}>
            S/ {Number(bono || 0).toFixed(2)}
          </div>
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <Input
            isDisabled={isFinalizado}
            aria-label="Feriados"
            type="text"
            onInput={onInputPrice}
            name="feriados"
            value={feriados || ""}
            onChange={handleChange}
            onBlur={() => handleSave()}
            size="sm"
            startContent={<span className="text-[10px] font-bold">S/</span>}
            classNames={inputUIClasses}
          />
        </td>
        <td className={`${tdYellow} min-w-[70px]`}>
          <div className={readOnlyTextClass}>
            S/ {Number(salario || 0).toFixed(2)}
          </div>
        </td>
        <td className={`${tdYellowLast} min-w-[70px]`}>
          <div className={readOnlyTextClass}>
            S/ {Number(adicionales || 0).toFixed(2)}
          </div>
        </td>
      </tr>
    </>
  );
};

export default TrAsistenciaOperativo;
