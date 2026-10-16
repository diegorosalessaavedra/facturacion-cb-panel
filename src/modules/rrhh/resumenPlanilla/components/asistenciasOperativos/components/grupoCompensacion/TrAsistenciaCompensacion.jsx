import React, { useState, useEffect, useRef } from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { formatDateES } from "../../../../../../../utils/formatDateTime";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import { toast } from "sonner";
import { onInputPrice } from "../../../../../../../assets/onInputs";
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

const safeFormatDateES = (dateStr, fallback = "--:--") => {
  if (!dateStr) return fallback;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return fallback;
  try {
    return formatDateES(dateStr);
  } catch (error) {
    return fallback;
  }
};

const TrAsistenciaCompensacion = ({
  compensacion,
  dia,
  findColaborador,
  sueldoFeriadoBruto,
  onDataUpdate,
  isFinalizado,
  asistenciasOperativas,
  isFirstRow,
  rowSpan,
}) => {
  const esFeriado = Boolean(dia?.bonificacion_feriado);

  const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);

  const aplicarReglasTurno = (
    datos,
    asistenciaActiva = asistenciaSeleccionada,
  ) => {
    let finalFeriado = "NO";
    if (esFeriado) {
      finalFeriado = datos.feriado || "SI";
    }

    const valorBono = Number(datos.bono || 0);
    const hrMinExtraStr = datos.hr_min_extra || "";
    const valorImpHoras = Number(datos.importe_horas || 0);
    const valorImpMinutos = Number(datos.importe_minutos || 0);

    // NUEVO: Capturamos directamente lo que el usuario tipea en total_planilla
    const valorTotalPlanilla = datos.total_planilla || "";

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
        let totalMinutosTotales = Math.floor(diffMs / 60000);

        if (asistenciaActiva && asistenciaActiva.total_horas_minutos) {
          const [astH, astM] = asistenciaActiva.total_horas_minutos.split(":");
          const astTotalMins =
            (parseInt(astH, 10) || 0) * 60 + (parseInt(astM, 10) || 0);

          totalMinutosTotales = totalMinutosTotales - astTotalMins;
        }

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

    const turnosFinal =
      dEntrada && dSalida ? datos.turnos : Number(datos.turnos || 0);
    const trabajo = Number(turnosFinal) > 0;

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
      total_horas_minutos: valTotalHoras,
      horas_enteras: valHoras,
      minutos_enteros: valMinutos,
      feriados_monto: valorFeriadosMonetario,
      adicionales: calculoAdicionales,
      total_efectivo: calculoAdicionales,

      // CAMPOS MANUALES
      turnos: datos.turnos || "",
      total_planilla: valorTotalPlanilla, // <-- Ya no se sobreescribe
      hr_min_extra: hrMinExtraStr,
      importe_horas: datos.importe_horas || "",
      importe_minutos: datos.importe_minutos || "",
      bono: datos.bono || "",
      salario: valorTotalPlanilla, // Asumimos que salario visualmente depende de planilla
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
      turnos: "",
      total_planilla: "", // Inicializamos en string vacío
      hr_min_extra: "",
      importe_horas: "",
      importe_minutos: "",
      bono: "",
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
        if (res.data.compensacion) {
          const { ...datosPrincipales } = res.data.compensacion;

          let foundAsistencia = null;
          if (datosPrincipales.asistencia_operativa_id) {
            foundAsistencia = asistenciasOperativas?.find(
              (op) =>
                String(op.id) ===
                String(datosPrincipales.asistencia_operativa_id),
            );
            if (foundAsistencia) {
              setAsistenciaSeleccionada(foundAsistencia);
            }
          }

          const newData = aplicarReglasTurno(
            {
              ...datosCompensacion,
              ...datosPrincipales,
            },
            foundAsistencia,
          );

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

    let foundAsistencia = asistenciaSeleccionada;

    if (name === "asistencia_operativa_id") {
      foundAsistencia = asistenciasOperativas?.find(
        (op) => String(op.id) === String(value),
      );
      setAsistenciaSeleccionada(foundAsistencia || null);
    }

    const nuevosDatos = aplicarReglasTurno(
      {
        ...datosCompensacion,
        [name]: value,
      },
      foundAsistencia,
    );

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
    // IMPORTANTE: Ya NO eliminamos total_planilla aquí

    for (const key in payload) {
      if (payload[key] === "") payload[key] = null;
    }

    const mySeq = ++saveSeqRef.current;
    const url = `${import.meta.env.VITE_URL_API}/compensacion-operativa/${payload.id || "0"}`;

    axios
      .post(url, payload, config)
      .then((res) => {
        const newId = res.data?.data?.id ?? payload.id;
        if (mySeq !== saveSeqRef.current) return;
        if (newId && newId !== datosRef.current.id) {
          setDatosCompensacion((prev) => {
            const updated = { ...prev, id: newId };
            datosRef.current = updated;
            return updated;
          });
        }
        toast.success("Compensación guardada");
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

  const {
    asistencia_operativa_id,
    feriado,
    turno,
    actividad_dia,
    entrada,
    salida,
    total_horas_minutos,
    horas_enteras,
    minutos_enteros,
    total_planilla,
    hr_min_extra,
    importe_horas,
    importe_minutos,
    bono,
    salario,
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
        {isFirstRow && (
          <td
            rowSpan={rowSpan}
            className="border-r border-slate-300 bg-blue-50/50 p-2 font-bold text-slate-800 uppercase text-[10px] whitespace-nowrap align-middle"
          >
            {findColaborador?.apellidos_colaborador} <br />
            {findColaborador?.nombre_colaborador}
          </td>
        )}

        <td className={`${tdBlue} min-w-[200px]`}>
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
              <SelectItem
                key={String(op.id)}
                textValue={`${safeFormatDateES(op.entrada)} - ${safeFormatDateES(op.salida)}`}
              >
                <p className="text-[9px] font-bold">
                  {safeFormatDateES(op.entrada)} - {safeFormatDateES(op.salida)}
                </p>
              </SelectItem>
            ))}
          </Select>
        </td>

        <td className={`${tdBlue} min-w-[70px] max-w-[70px]ß`}>
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

        <td className={`${tdGreen} min-w-[70px]`}>
          <Input
            isDisabled={isFinalizado}
            aria-label="Total Planilla"
            type="text"
            onInput={onInputPrice}
            name="total_planilla"
            value={total_planilla || ""}
            onChange={handleChange}
            onBlur={() => handleSave()}
            size="sm"
            startContent={<span className="text-[10px] font-bold">S/</span>}
            classNames={inputUIClasses}
          />
        </td>

        <td className={`${tdGreen} min-w-[80px]`}>
          <Input
            isDisabled={isFinalizado}
            aria-label="Horas y Minutos Extra"
            type="text"
            name="hr_min_extra"
            value={hr_min_extra || ""}
            onChange={handleChange}
            onBlur={() => handleSave()}
            size="sm"
            placeholder="HH:MM"
            classNames={inputUIClasses}
          />
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <Input
            isDisabled={isFinalizado}
            aria-label="Importe Horas"
            type="text"
            onInput={onInputPrice}
            name="importe_horas"
            value={importe_horas || ""}
            onChange={handleChange}
            onBlur={() => handleSave()}
            size="sm"
            startContent={<span className="text-[10px] font-bold">S/</span>}
            classNames={inputUIClasses}
          />
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <Input
            isDisabled={isFinalizado}
            aria-label="Importe Minutos"
            type="text"
            onInput={onInputPrice}
            name="importe_minutos"
            value={importe_minutos || ""}
            onChange={handleChange}
            onBlur={() => handleSave()}
            size="sm"
            startContent={<span className="text-[10px] font-bold">S/</span>}
            classNames={inputUIClasses}
          />
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
            startContent={<span className="text-[10px] font-bold">S/</span>}
            classNames={inputUIClasses}
          />
        </td>

        <td className={`${tdYellow} min-w-[70px]`}>
          <div className={readOnlyTextClass}>
            S/ {Number(salario || 0).toFixed(2)}
          </div>
        </td>
      </tr>
    </>
  );
};

export default TrAsistenciaCompensacion;
