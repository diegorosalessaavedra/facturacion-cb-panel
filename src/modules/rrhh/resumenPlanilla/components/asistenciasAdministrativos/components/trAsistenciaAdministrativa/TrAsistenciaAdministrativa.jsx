import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import {
  formatDateES,
  formatToPeruTime,
} from "../../../../../../../utils/formatDateTime";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import { toast } from "sonner";
import {
  onInputNumber,
  onInputPrice,
} from "../../../../../../../assets/onInputs";
import EditTimeModal from "./EditTimeModal";
import { handleAxiosError } from "../../../../../../../utils/handleAxiosError";

// --- FUNCIÓN HELPER PARA QUITAR SEGUNDOS ("12:28:00" -> "12:28") ---
const formatTimeWithoutSeconds = (timeStr) => {
  if (!timeStr) return null;
  // Corta el string para tomar solo los primeros 5 caracteres (HH:MM)
  return timeStr.substring(0, 5);
};

const TrAsistenciaAdministrativa = ({
  dia,
  findColaborador,
  sueldoPorDia,
  sueldoFeriadoBruto,
  onDataUpdate,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
      goce_vacaciones: "NO",
      turno: "DIURNO",
      actividad_dia: "",
      hora_entrada: "",
      hora_salida: "",
      huellero_entrada: null,
      huellero_salida: null,
      tardanza_minutos: 0,
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
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/${dia.id}/${findColaborador.id}`;
    axios
      .get(url, config)
      .then((res) => {
        if (res.data.asistencia) {
          const {
            calculo_asistencia_administrativo,
            peticion_entrada_salida,
            ...datosPrincipales
          } = res.data.asistencia;
          const {
            id: idCalculo,
            asistencia_administrativo_id,
            ...datosCalculoLimpio
          } = calculo_asistencia_administrativo || {};

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

  const handleAsistenciaHuellero = () => {
    if (!dia?.dia_plantilla || !findColaborador?.dni_colaborador) return;
    const url = `${import.meta.env.VITE_URL_API}/asistencia-huellero?fecha=${dia.dia_plantilla}&dni=${findColaborador.dni_colaborador}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data?.asistencias) {
          const { entrada, salida } = res.data.asistencias;
          // Formateará algo como "12:28:00"
          const hEntrada = formatToPeruTime(entrada?.punch_time);
          const hSalida = formatToPeruTime(salida?.punch_time);

          setDatosAsistencia((prev) => {
            const newData = {
              ...prev,
              // Guardamos en estado el valor original
              huellero_entrada: hEntrada,
              huellero_salida: hSalida,
            };

            // Al pasar a hora_entrada/salida, ya lo guardamos formateado a HH:MM
            // Así evitamos guardar "12:28:00" en el input
            if (!prev.hora_entrada)
              newData.hora_entrada = formatTimeWithoutSeconds(hEntrada);
            if (!prev.hora_salida)
              newData.hora_salida = formatTimeWithoutSeconds(hSalida);

            const calculos = calcularTiempos(
              newData.hora_entrada,
              newData.hora_salida,
            );
            const finalData = aplicarReglasTurno({ ...newData, ...calculos });

            datosRef.current = finalData;
            if (onDataUpdate) onDataUpdate(finalData);
            return finalData;
          });
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    handleAsistencia();
    handleAsistenciaHuellero();
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

  const handleConfirmarEdicionTiempo = (nuevaEntrada, nuevaSalida) => {
    const calculos = calcularTiempos(nuevaEntrada, nuevaSalida);
    setDatosAsistencia((prev) => {
      const nuevosDatos = aplicarReglasTurno({
        ...prev,
        hora_entrada: formatTimeWithoutSeconds(nuevaEntrada), // Por si acaso también lo formateamos
        hora_salida: formatTimeWithoutSeconds(nuevaSalida),
        ...calculos,
      });
      datosRef.current = nuevosDatos;
      if (onDataUpdate) onDataUpdate(nuevosDatos);
      return nuevosDatos;
    });
  };

  const calcularTiempos = (entrada, salida) => {
    let tardanza_minutos = 0,
      horas_enteras = 0,
      minutos_enteros = 0,
      total_horas_minutos = "";
    if (entrada) {
      const [entHora, entMin] = entrada.split(":").map(Number);
      const refTotalMinutos = 9 * 60;
      const entTotalMinutos = entHora * 60 + entMin;
      tardanza_minutos = Math.max(0, entTotalMinutos - refTotalMinutos);

      if (salida) {
        const [salHora, salMin] = salida.split(":").map(Number);
        let diffMinutos = salHora * 60 + salMin - entTotalMinutos;
        if (diffMinutos < 0) diffMinutos += 24 * 60;
        diffMinutos = Math.max(0, diffMinutos - 60);
        horas_enteras = Math.floor(diffMinutos / 60);
        minutos_enteros = diffMinutos % 60;
        total_horas_minutos = `${String(horas_enteras).padStart(2, "0")}:${String(minutos_enteros).padStart(2, "0")}`;
      }
    }
    return {
      tardanza_minutos,
      total_horas_minutos,
      horas_enteras,
      minutos_enteros,
    };
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
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/${payload.id || "0"}`;

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
    goce_vacaciones,
    turno,
    actividad_dia,
    hora_entrada,
    hora_salida,
    huellero_entrada,
    huellero_salida,
    tardanza_minutos,
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

  // --- LÓGICA DEL SEMÁFORO ACTUALIZADA ---
  const getDynamicTimeClass = (tipo) => {
    // Usamos el helper para comparar ambos tiempos en formato HH:MM
    const actual = formatTimeWithoutSeconds(
      tipo === "entrada" ? hora_entrada : hora_salida,
    );
    const huellero = formatTimeWithoutSeconds(
      tipo === "entrada" ? huellero_entrada : huellero_salida,
    );

    if (!actual) return "bg-white border border-slate-200 shadow-sm";

    // Ahora "12:28" sí es igual a "12:28"
    if (actual === huellero)
      return "bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm";

    return "bg-orange-100 text-orange-700 border border-orange-300 shadow-sm";
  };

  // --- LÓGICA DEL TOOLTIP MEJORADA ---
  const getTooltipMessage = (tipo) => {
    // Para el mensaje, sí mostramos el original completo si queremos
    const actual = formatTimeWithoutSeconds(
      tipo === "entrada" ? hora_entrada : hora_salida,
    );
    const huellero_completo =
      tipo === "entrada" ? huellero_entrada : huellero_salida;
    const huellero_recortado = formatTimeWithoutSeconds(huellero_completo);

    const mensajeHuellero = huellero_completo
      ? `Hora huellero: ${huellero_completo}`
      : "No tiene registro en el huellero";

    if (!actual) return `${mensajeHuellero} (Clic para agregar)`;
    if (actual === huellero_recortado)
      return `${mensajeHuellero} (Clic para editar)`;

    return `Editado manual. (${mensajeHuellero})`;
  };

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
        <td className={`${tdBlue} min-w-[150px]`}>
          <Select
            aria-label="Goce de vacaciones"
            name="goce_vacaciones"
            selectedKeys={new Set([goce_vacaciones])}
            onChange={handleSelectChange}
            size="sm"
            classNames={selectUIClasses}
          >
            {opcionesSiNo.map((op) => (
              <SelectItem key={op.key} textValue={op.label}>
                <p className="text-[9px]">{op.label}</p>
              </SelectItem>
            ))}
          </Select>
        </td>
        <td className={`${tdBlue} min-w-[100px]`}>
          <Select
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

        {/* Celda Hora Entrada */}
        <td
          className={`${tdBlue} min-w-[80px] hover:brightness-95 transition cursor-pointer`}
          onClick={onOpen}
        >
          <Tooltip
            content={getTooltipMessage("entrada")}
            delay={300}
            placement="top"
          >
            <div
              className={`${readOnlyTextClass} ${getDynamicTimeClass("entrada")}`}
            >
              {hora_entrada || "-"}
            </div>
          </Tooltip>
        </td>

        {/* Celda Hora Salida */}
        <td
          className={`${tdBlue} min-w-[80px] hover:brightness-95 transition cursor-pointer`}
          onClick={onOpen}
        >
          <Tooltip
            content={getTooltipMessage("salida")}
            delay={300}
            placement="top"
          >
            <div
              className={`${readOnlyTextClass} ${getDynamicTimeClass("salida")}`}
            >
              {hora_salida || "-"}
            </div>
          </Tooltip>
        </td>

        <td className={`${tdBlue} min-w-[60px]`}>
          <div className={readOnlyTextClass}>{tardanza_minutos || "0"}</div>
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
        <td className={`${tdBlue} min-w-[60px]`}>
          <Input
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

      <EditTimeModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        datosAsistencia={datosAsistencia}
        onConfirm={handleConfirmarEdicionTiempo}
      />
    </>
  );
};

export default TrAsistenciaAdministrativa;
