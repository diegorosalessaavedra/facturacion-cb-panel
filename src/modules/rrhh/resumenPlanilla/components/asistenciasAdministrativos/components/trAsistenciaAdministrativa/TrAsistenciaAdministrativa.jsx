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

const TrAsistenciaAdministrativa = ({
  dia,
  findColaborador,
  sueldoPorDia,
  sueldoFeriadoBruto,
  onDataUpdate,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // --- LÓGICA AUTOMÁTICA DE FERIADOS ---
  const esFeriado = Boolean(dia?.bonificacion_feriado);
  const valorAsistenciaFeriado = esFeriado ? "SI" : "NO";
  const valorMontoFeriado = esFeriado ? sueldoFeriadoBruto || 0.0 : 0.0;

  // --- REGLA DE NEGOCIO CORREGIDA ---
  const aplicarReglasTurno = (datos) => {
    const cantTurnos = Number(datos.turnos || 0);
    const trabajo = cantTurnos > 0;

    const valorBono = Number(datos.bono || 0);
    const valorImpHoras = Number(datos.importe_horas || 0);
    const valorImpMinutos = Number(datos.importe_minutos || 0);

    // SOLUCIÓN: Multiplicamos el sueldo base por los turnos (ej. si hace 2 turnos, cobra el doble base)
    const basePlanilla = sueldoPorDia * cantTurnos;

    return {
      ...datos,
      total_planilla: trabajo ? basePlanilla : 0,
      asistencia_feriado: valorAsistenciaFeriado,
      feriados: trabajo ? valorMontoFeriado : 0,
      // SOLUCIÓN: El salario del día ES la suma de su base por turnos + su dinero extra por horas
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
      peticion_entrada_salida: null,
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
          const { calculo_asistencia_administrativo, ...datosPrincipales } =
            res.data.asistencia;

          if (typeof datosPrincipales.peticion_entrada_salida === "string") {
            try {
              datosPrincipales.peticion_entrada_salida = JSON.parse(
                datosPrincipales.peticion_entrada_salida,
              );
            } catch (e) {}
          }

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
      .catch((err) => console.error("Error al cargar asistencia:", err));
  };

  const handleAsistenciaHuellero = () => {
    if (!dia?.dia_plantilla || !findColaborador?.dni_colaborador) return;

    const url = `${import.meta.env.VITE_URL_API}/asistencia-huellero?fecha=${dia.dia_plantilla}&dni=${findColaborador.dni_colaborador}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data?.asistencias) {
          const { entrada, salida } = res.data.asistencias;

          const hEntrada = formatToPeruTime(entrada?.punch_time);
          const hSalida = formatToPeruTime(salida?.punch_time);
          const calculos = calcularTiempos(hEntrada, hSalida);

          setDatosAsistencia((prev) => {
            const newData = aplicarReglasTurno({
              ...prev,
              hora_entrada: hEntrada,
              hora_salida: hSalida,
              ...calculos,
            });

            datosRef.current = newData;
            if (onDataUpdate) onDataUpdate(newData);
            return newData;
          });
        }
      })
      .catch((err) =>
        console.error("Error al cargar asistencia huellero:", err),
      );
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

  const handleConfirmarEdicionTiempo = (nuevaEntrada, nuevaSalida, motivo) => {
    const calculos = calcularTiempos(nuevaEntrada, nuevaSalida);
    setDatosAsistencia((prev) => {
      const nuevosDatos = aplicarReglasTurno({
        ...prev,
        peticion_entrada_salida: {
          entrada: nuevaEntrada,
          salida: nuevaSalida,
          motivo: motivo,
          estado: "pendiente",
        },
        ...calculos,
      });
      datosRef.current = nuevosDatos;
      if (onDataUpdate) onDataUpdate(nuevosDatos);
      handleSave(nuevosDatos);
      return nuevosDatos;
    });
  };

  const calcularTiempos = (entrada, salida) => {
    let tardanza_minutos = 0;
    let total_horas_minutos = "";
    let horas_enteras = 0;
    let minutos_enteros = 0;

    if (entrada) {
      const [entHora, entMin] = entrada.split(":").map(Number);
      const refTotalMinutos = 9 * 60;
      const entTotalMinutos = entHora * 60 + entMin;

      tardanza_minutos = entTotalMinutos - refTotalMinutos;
      if (tardanza_minutos < 0) tardanza_minutos = 0;

      if (salida) {
        const [salHora, salMin] = salida.split(":").map(Number);
        const salTotalMinutos = salHora * 60 + salMin;

        let diffMinutos = salTotalMinutos - entTotalMinutos;
        if (diffMinutos < 0) diffMinutos += 24 * 60;
        diffMinutos -= 60;
        if (diffMinutos < 0) diffMinutos = 0;

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

    for (const key in payload) {
      if (payload[key] === "") payload[key] = null;
    }

    if (
      payload.peticion_entrada_salida &&
      typeof payload.peticion_entrada_salida === "object"
    ) {
      payload.peticion_entrada_salida = JSON.stringify(
        payload.peticion_entrada_salida,
      );
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
      .catch((err) => {
        console.error(err);
        toast.error("Error al guardar", { id: toastId });
      });
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
    peticion_entrada_salida,
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

  const estadoPeticion = peticion_entrada_salida?.estado;
  const mostrarEntrada = peticion_entrada_salida
    ? peticion_entrada_salida.entrada
    : hora_entrada;
  const mostrarSalida = peticion_entrada_salida
    ? peticion_entrada_salida.salida
    : hora_salida;

  const getDynamicTimeClass = () => {
    if (estadoPeticion === "pendiente")
      return "bg-amber-100 text-amber-700 border border-amber-300 shadow-sm";
    if (estadoPeticion === "aprobado")
      return "bg-sky-100 text-sky-700 border border-sky-300 shadow-sm";
    if (hora_entrada || hora_salida)
      return "bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm";
    return "bg-white border border-slate-200 shadow-sm";
  };

  const getTooltipMessage = () => {
    if (estadoPeticion === "pendiente")
      return "Edición pendiente de aprobación";
    if (estadoPeticion === "aprobado") return "Edición manual aprobada";
    return "Dato biométrico original. Clic para editar";
  };

  return (
    <>
      <tr className="group hover:bg-slate-50 transition-colors">
        <td
          className={` ${tdBlue} uppercase text-[9px] whitespace-nowrap align-middle min-w-[180px]`}
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

        <td
          className={`${tdBlue} min-w-[80px] hover:brightness-95 transition cursor-pointer`}
          onClick={onOpen}
        >
          <Tooltip content={getTooltipMessage()} delay={300} placement="top">
            <div className={`${readOnlyTextClass} ${getDynamicTimeClass()}`}>
              {mostrarEntrada || "-"}
            </div>
          </Tooltip>
        </td>

        <td
          className={`${tdBlue} min-w-[80px] hover:brightness-95 transition cursor-pointer`}
          onClick={onOpen}
        >
          <Tooltip content={getTooltipMessage()} delay={300} placement="top">
            <div className={`${readOnlyTextClass} ${getDynamicTimeClass()}`}>
              {mostrarSalida || "-"}
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
