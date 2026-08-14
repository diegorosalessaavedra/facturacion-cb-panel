import React, { useState, useEffect, useRef } from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { formatDateES } from "../../../../../../utils/formatDateTime";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { toast } from "sonner";
import { onInputNumber, onInputPrice } from "../../../../../../assets/onInputs";

const TrAsistenciaAdministrativa = ({
  dia,
  findColaborador,
  sueldoPorDia,
  sueldoFeriadoBruto,
  onDataUpdate,
}) => {
  const [lastSavedData, setLastSavedData] = useState(null);

  // --- LÓGICA AUTOMÁTICA DE FERIADOS ---
  const esFeriado = Boolean(dia?.bonificacion_feriado);
  const valorAsistenciaFeriado = esFeriado ? "SI" : "NO";
  const valorMontoFeriado = esFeriado ? sueldoFeriadoBruto || 0.0 : 0.0;

  // --- REGLA DE NEGOCIO: SI TURNOS ES 0, NO HAY PAGO ---
  const aplicarReglasTurno = (datos) => {
    const cantTurnos = Number(datos.turnos || 0);
    const trabajo = cantTurnos > 0;

    return {
      ...datos,
      total_planilla: trabajo ? sueldoPorDia : 0,
      asistencia_feriado: valorAsistenciaFeriado,
      feriados: trabajo ? valorMontoFeriado : 0,
      salario: trabajo ? sueldoPorDia : 0,
      adicionales: trabajo ? valorMontoFeriado : 0,
    };
  };

  // Inicializamos el estado pasándolo por la regla de negocio para que inicie en 0
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

          // Aplicamos las reglas a lo que traiga la base de datos
          const newData = aplicarReglasTurno({
            ...datosAsistencia,
            ...datosPrincipales,
            ...(calculo_asistencia_administrativo || {}),
          });

          setDatosAsistencia(newData);
          setLastSavedData(newData);
          if (onDataUpdate) onDataUpdate(newData);
        } else {
          if (onDataUpdate) onDataUpdate(datosAsistencia);
        }
      })
      .catch((err) => console.error("Error al cargar asistencia:", err));
  };

  useEffect(() => {
    handleAsistencia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosAsistencia((prev) => {
      // Evaluamos la regla con el nuevo tipeo (ej: si borran el turno, se pone en 0)
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

  // --- LÓGICA DE AUTOMATIZACIÓN DE TIEMPO ---
  const calcularTiempos = (entrada, salida) => {
    let tardanza_minutos = 0;
    let total_horas_minutos = "";
    let horas_enteras = 0;
    let minutos_enteros = 0;

    if (entrada) {
      const [entHora, entMin] = entrada.split(":").map(Number);

      const refTotalMinutos = 9 * 60; // 540 minutos desde las 00:00
      const entTotalMinutos = entHora * 60 + entMin;

      tardanza_minutos = entTotalMinutos - refTotalMinutos;
      if (tardanza_minutos < 0) tardanza_minutos = 0;

      if (salida) {
        const [salHora, salMin] = salida.split(":").map(Number);
        const salTotalMinutos = salHora * 60 + salMin;

        let diffMinutos = salTotalMinutos - entTotalMinutos;

        if (diffMinutos < 0) {
          diffMinutos += 24 * 60;
        }

        // --- RESTA DE 1 HORA DE REFRIGERIO ---
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

  const handleTimeBlur = () => {
    const calculos = calcularTiempos(
      datosAsistencia.hora_entrada,
      datosAsistencia.hora_salida,
    );

    const nuevosDatos = aplicarReglasTurno({
      ...datosAsistencia,
      ...calculos,
    });

    datosRef.current = nuevosDatos;
    setDatosAsistencia(nuevosDatos);
    if (onDataUpdate) onDataUpdate(nuevosDatos);
    handleSave(nuevosDatos);
  };

  const handleSave = (datosAEnviar = datosRef.current) => {
    const payload = { ...datosAEnviar };

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
        setLastSavedData({ ...payload, id: newId });

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

  // --- ESTILOS ---
  const inputUIClasses = {
    inputWrapper:
      "min-h-[25px] h-[25px] px-1 bg-transparent shadow-none hover:bg-white/70 data-[focus=true]:bg-white data-[focus=true]:shadow-sm transition-all",
    input: "text-[10px] text-center text-slate-700 font-medium",
  };

  const selectUIClasses = {
    trigger:
      "min-h-[25px] h-[25px] px-1 bg-transparent shadow-none hover:bg-white/70 data-[open=true]:bg-white data-[open=true]:shadow-sm transition-all",
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
    tardanza_minutos,
    total_horas_minutos,
    horas_enteras,
    minutos_enteros,
    turnos,
    total_planilla, // Añadido para el render visual
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
          name="goce_vacaciones"
          selectedKeys={new Set([goce_vacaciones])}
          onChange={handleSelectChange}
          size="sm"
          radius="sm"
          classNames={selectUIClasses}
          aria-label="Goce Vacaciones"
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
          name="turno"
          selectedKeys={new Set([turno])}
          onChange={handleSelectChange}
          size="sm"
          radius="sm"
          classNames={selectUIClasses}
          aria-label="Turno"
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
          type="text"
          name="actividad_dia"
          value={actividad_dia || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          placeholder="..."
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Actividad"
        />
      </td>

      <td className={`${tdBlue} min-w-[80px]`}>
        <Input
          type="time"
          name="hora_entrada"
          value={hora_entrada || ""}
          onChange={handleChange}
          onBlur={handleTimeBlur}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Entrada"
        />
      </td>

      <td className={`${tdBlue} min-w-[80px]`}>
        <Input
          type="time"
          name="hora_salida"
          value={hora_salida || ""}
          onChange={handleChange}
          onBlur={handleTimeBlur}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Salida"
        />
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
          type="text"
          onInput={onInputNumber}
          name="turnos"
          value={turnos || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Turnos"
        />
      </td>

      {/* =========================================
          GRUPO 2: CÁLCULOS (VERDE)
          ========================================= */}

      <td className={`${tdGreen} min-w-[70px]`}>
        {/* AHORA USA LA VARIABLE DE ESTADO EN LUGAR DEL PROP DIRECTO */}
        <div className={readOnlyTextClass}>
          {Number(total_planilla || 0).toFixed(2)}
        </div>
      </td>

      <td className={`${tdGreen} min-w-[80px]`}>
        <Input
          type="text"
          name="hr_min_extra"
          value={hr_min_extra || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          placeholder="Ej: 01:30"
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Hr y Min Extra"
        />
      </td>

      <td className={`${tdGreen} min-w-[70px]`}>
        <Input
          type="text"
          onInput={onInputPrice}
          name="importe_horas"
          value={importe_horas || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Importe Horas"
        />
      </td>

      <td className={`${tdGreen} min-w-[70px]`}>
        <Input
          type="text"
          onInput={onInputPrice}
          name="importe_minutos"
          value={importe_minutos || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Importe Minutos"
        />
      </td>

      <td className={`${tdGreen} min-w-[70px]`}>
        <Input
          type="text"
          onInput={onInputPrice}
          name="bono"
          value={bono || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Bono"
        />
      </td>

      <td className={`${tdGreen} min-w-[70px]`}>
        <div className={readOnlyTextClass}>
          {Number(feriados || 0).toFixed(2)}
        </div>
      </td>

      {/* =========================================
          GRUPO 3: SUBTOTALES (ÁMBAR/AMARILLO)
          ========================================= */}

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
  );
};

export default TrAsistenciaAdministrativa;
