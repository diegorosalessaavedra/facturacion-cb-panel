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
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const TrAsistenciaCompensacion = ({
  compensacion,
  dia,
  findColaborador,
  sueldoPorDia,
  valorHora,
  sueldoFeriadoBruto,
  onDataUpdate,
  isFinalizado,
  bono_extraordinario,
  asistenciasOperativas,
  isFirstRow, // <-- Nueva prop
  rowSpan, // <-- Nueva prop
}) => {
  const esFeriado = Boolean(dia?.bonificacion_feriado);

  const aplicarReglasTurno = (datos) => {
    let finalFeriado = "NO";
    if (esFeriado) {
      finalFeriado = datos.feriado || "SI";
    }

    let valorBono = Number(datos.bono || 0);
    if (datos.turno === "NOCTURNO ATO" || datos.turno === "VIAJES") {
      valorBono = Number(bono_extraordinario || 0);
    } else {
      if (
        valorBono === Number(bono_extraordinario || 0) &&
        Number(bono_extraordinario || 0) !== 0
      ) {
        valorBono = 0;
      }
    }

    const vHora = Number(valorHora || 0);
    const vMinuto = vHora / 60;

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

    const trabajo = turnosFinal > 0;
    const basePlanilla = sueldoPorDia * turnosFinal;

    const calculoImporteHoras = horasExtrasEnteras * vHora;
    const calculoImporteMinutos = minutosExtras > 40 ? vHora : 0;

    const valorImpHoras =
      dEntrada && dSalida
        ? calculoImporteHoras
        : Number(datos.importe_horas || 0);
    const valorImpMinutos =
      dEntrada && dSalida
        ? calculoImporteMinutos
        : Number(datos.importe_minutos || 0);

    let valorFeriadosMonetario = datos.feriados_monto;
    if (finalFeriado === "NO") {
      valorFeriadosMonetario = 0;
    } else if (
      valorFeriadosMonetario === undefined ||
      valorFeriadosMonetario === null ||
      valorFeriadosMonetario === ""
    ) {
      valorFeriadosMonetario = trabajo ? Number(sueldoFeriadoBruto || 0) : 0;
    }

    const calculoAdicionales = trabajo
      ? Number(valorFeriadosMonetario) +
        valorBono +
        valorImpHoras +
        valorImpMinutos
      : 0;

    return {
      ...datos,
      feriado: finalFeriado,
      bono: valorBono > 0 ? valorBono.toFixed(2) : "",
      total_horas_minutos: valTotalHoras,
      horas_enteras: valHoras,
      minutos_enteros: valMinutos,
      turnos: turnosFinal.toString(),
      hr_min_extra: hrMinExtraStr,
      importe_horas: valorImpHoras ? valorImpHoras.toFixed(2) : "0.00",
      importe_minutos: valorImpMinutos ? valorImpMinutos.toFixed(2) : "0.00",
      total_planilla: trabajo ? basePlanilla : 0,
      feriados_monto: valorFeriadosMonetario,
      salario: trabajo ? basePlanilla : 0,
      adicionales: calculoAdicionales,
      total_efectivo: calculoAdicionales,
    };
  };

  const [datosCompensacion, setDatosCompensacion] = useState(() =>
    aplicarReglasTurno({
      id: compensacion?.id || null,
      semana_planilla_id:
        compensacion?.semana_planilla_id ||
        dia?.semana_plantilla_id ||
        dia?.semana_planilla_id ||
        null,
      colaborador_id: findColaborador?.id || null,
      asistencia_operativa_id: compensacion?.asistencia_operativa_id || null,
      feriado: esFeriado ? "SI" : "NO",
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
      feriados_monto: 0.0,
      salario: 0.0,
      adicionales: 0.0,
      total_efectivo: 0.0,
    }),
  );

  const datosRef = useRef(datosCompensacion);
  useEffect(() => {
    datosRef.current = datosCompensacion;
  }, [datosCompensacion]);

  const saveSeqRef = useRef(0);

  const handleAsistencia = () => {
    if (!compensacion?.id) return;
    const url = `${import.meta.env.VITE_URL_API}/compensacion-operativa/${compensacion.id}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data.asistencia) {
          const { ...datosPrincipales } = res.data.asistencia;
          const newData = aplicarReglasTurno({
            ...datosCompensacion,
            ...datosPrincipales,
          });
          setDatosCompensacion(newData);
          if (onDataUpdate) onDataUpdate(newData);
        } else {
          if (onDataUpdate) onDataUpdate(datosCompensacion);
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
    setDatosCompensacion((prev) => {
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
      ...datosCompensacion,
      [name]: value,
    });
    datosRef.current = nuevosDatos;
    setDatosCompensacion(nuevosDatos);
    if (onDataUpdate) onDataUpdate(nuevosDatos);
    handleSave(nuevosDatos);
  };

  const handleSave = (datosAEnviar = datosRef.current) => {
    const payload = { ...datosAEnviar };
    delete payload.huellero_entrada;
    delete payload.huellero_salida;
    delete payload.feriados_monto;
    delete payload.salario;
    delete payload.adicionales;
    delete payload.total_planilla;

    for (const key in payload) {
      if (payload[key] === "") payload[key] = null;
    }

    const mySeq = ++saveSeqRef.current;
    const toastId = toast.loading("Guardando...");
    const url = `${import.meta.env.VITE_URL_API}/compensacion-operativa/${payload.id || "0"}`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Guardado", { id: toastId });
        const newId = res.data?.data?.id ?? payload.id;
        if (mySeq !== saveSeqRef.current) return;
        if (newId && newId !== datosRef.current.id) {
          setDatosCompensacion((prev) => {
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
    asistencia_operativa_id, // Usado en el Select
    feriado,
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
    feriados_monto,
    salario,
    adicionales,
  } = datosCompensacion;

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
        {/* Celda del nombre que SOLO se imprime en el primer registro */}
        {isFirstRow && (
          <td
            rowSpan={rowSpan}
            className="border-r border-slate-300 bg-blue-50/50 p-2 font-bold text-slate-800 uppercase text-[10px] whitespace-nowrap align-middle"
          >
            {findColaborador?.apellidos_colaborador} <br />
            {findColaborador?.nombre_colaborador}
          </td>
        )}

        {/* CORRECCIÓN: Select para elegir la asistencia de donde provienen los datos */}
        <td className={`${tdBlue} min-w-[120px]`}>
          <Select
            isDisabled={isFinalizado}
            aria-label="Asistencia Operativa"
            name="asistencia_operativa_id"
            selectedKeys={new Set([String(asistencia_operativa_id || "")])}
            onChange={handleSelectChange}
            size="sm"
            classNames={selectUIClasses}
          >
            {asistenciasOperativas?.map((op) => (
              <SelectItem key={String(op.id)} textValue={`Ref: ${op.id}`}>
                <p className="text-[9px] font-bold">
                  {formatDateES(op.entrada)} - {formatDateES(op.salida)}
                </p>
              </SelectItem>
            ))}
          </Select>
        </td>

        <td
          className={`${tdBlue} uppercase text-[9px] whitespace-nowrap align-middle min-w-[180px]`}
        >
          {formatDateES(dia?.dia_plantilla) || "-"}
        </td>

        <td className={`${tdBlue} min-w-[70px]`}>
          <Select
            isDisabled={isFinalizado || !esFeriado}
            aria-label="Feriado"
            name="feriado"
            selectedKeys={new Set([feriado])}
            onChange={handleSelectChange}
            size="sm"
            classNames={selectUIClasses}
          >
            {(!esFeriado ? [{ key: "NO", label: "NO" }] : opcionesFeriado).map(
              (op) => (
                <SelectItem key={op.key} textValue={op.label}>
                  <p className="text-[9px] font-bold">{op.label}</p>
                </SelectItem>
              ),
            )}
          </Select>
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
            name="feriados_monto"
            value={feriados_monto || ""}
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

export default TrAsistenciaCompensacion;
