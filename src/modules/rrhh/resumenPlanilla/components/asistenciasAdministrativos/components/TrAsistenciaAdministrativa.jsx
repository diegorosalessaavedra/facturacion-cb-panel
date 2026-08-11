import React, { useState, useEffect, useRef } from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { formatDateES } from "../../../../../../utils/formatDateTime";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { toast } from "sonner";

const TrAsistenciaAdministrativa = ({ dia, findColaborador }) => {
  const [lastSavedData, setLastSavedData] = useState(null);

  const [datosAsistencia, setDatosAsistencia] = useState({
    id: null,
    dia_planilla_id: dia?.id || null,
    colaborador_id: findColaborador?.id || null,

    // --- DATOS DE ENTRADA Y SALIDA ---
    asistencia_feriado: "NO",
    goce_vacaciones: "NO",
    turno: "DIURNO",
    actividad_dia: "",
    hora_entrada: "",
    hora_salida: "",
    tardanza_minutos: 0,
    total_horas_minutos: "",
    horas_enteras: "",
    minutos_enteros: "",
    turnos: "",

    // --- CÁLCULOS ---
    total_planilla: 0.0,
    hr_min_extra: "",
    importe_horas: 0.0,
    importe_minutos: 0.0,
    bono: 0.0,
    feriados: 0.0,

    // --- SUBTOTALES ---
    salario: 0.0,
    adicionales: 0.0,

    estado: "PENDIENTE DE ENVIAR",
  });

  // --- REF QUE SIEMPRE TIENE EL DATO MÁS FRESCO ---
  // Se usa como fuente de verdad al guardar, evitando closures viejos
  // cuando handleSave se llama sin argumento (onBlur).
  const datosRef = useRef(datosAsistencia);
  useEffect(() => {
    datosRef.current = datosAsistencia;
  }, [datosAsistencia]);

  // Contador de requests en vuelo: si una respuesta "vieja" llega
  // después de que ya se disparó un guardado más nuevo, la ignoramos.
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
          const newData = {
            ...datosAsistencia,
            ...datosPrincipales,
            ...(calculo_asistencia_administrativo || {}),
          };

          setDatosAsistencia(newData);
          setLastSavedData(newData);
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
      const updated = { ...prev, [name]: value };
      datosRef.current = updated; // actualización síncrona, sin esperar al efecto
      return updated;
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (!value) return;

    const nuevosDatos = { ...datosAsistencia, [name]: value };
    datosRef.current = nuevosDatos;
    setDatosAsistencia(nuevosDatos);
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

      // 1. Cálculo de Tardanza (Referencia: 09:00 AM)
      const refTotalMinutos = 9 * 60; // 540 minutos desde las 00:00
      const entTotalMinutos = entHora * 60 + entMin;

      tardanza_minutos = entTotalMinutos - refTotalMinutos;
      if (tardanza_minutos < 0) tardanza_minutos = 0;

      // 2. Cálculo de Horas Trabajadas
      if (salida) {
        const [salHora, salMin] = salida.split(":").map(Number);
        const salTotalMinutos = salHora * 60 + salMin;

        let diffMinutos = salTotalMinutos - entTotalMinutos;

        if (diffMinutos < 0) {
          diffMinutos += 24 * 60; // Turno nocturno / amanecida
        }

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

    const nuevosDatos = {
      ...datosAsistencia,
      ...calculos,
    };

    datosRef.current = nuevosDatos;
    setDatosAsistencia(nuevosDatos);
    handleSave(nuevosDatos);
  };
  // ------------------------------------------

  // IMPORTANTE: el valor por defecto ahora viene del ref, no del estado
  // capturado en el closure del render, así siempre se guarda el dato
  // más reciente sin importar cuándo se dispare el onBlur.
  const handleSave = (datosAEnviar = datosRef.current) => {
    if (
      lastSavedData &&
      JSON.stringify(datosAEnviar) === JSON.stringify(lastSavedData)
    ) {
      return;
    }

    const payload = { ...datosAEnviar };
    for (const key in payload) {
      if (payload[key] === "") payload[key] = null;
    }

    const mySeq = ++saveSeqRef.current;
    const toastId = toast.loading("Guardando...");
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/${payload.id}`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Guardado", { id: toastId });

        // Guardamos qué se envió, para la comparación de "sin cambios"
        const newId = res.data?.data?.id ?? payload.id;
        setLastSavedData({ ...payload, id: newId });

        // Si mientras esta request viajaba se disparó un guardado más
        // nuevo, esta respuesta ya está desactualizada: NO tocamos el
        // estado visible (evita pisar lo que el usuario ya escribió).
        if (mySeq !== saveSeqRef.current) return;

        // Solo sincronizamos el id (por si era un registro nuevo).
        // Nunca sobreescribimos todo el objeto con el payload viejo.
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

  // --- ESTILOS PARA INPUTS Y SELECTS ---
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

  // --- ESTILOS PARA CAMPOS AUTOMÁTICOS (Texto Plano) ---
  const readOnlyTextClass =
    "min-h-[25px] h-[25px] w-full flex items-center justify-center text-[10px] text-slate-600 font-bold bg-black/5 rounded-sm px-1";

  // --- COLORES CORPORATIVOS PARA LAS CELDAS ---
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
    <tr className="group hover:bg-slate-50 transition-colors">
      {/* =========================================
          GRUPO 1: DATOS DE ENTRADA Y SALIDA (AZUL)
          ========================================= */}

      <td className={`${tdBlue} min-w-[70px]`}>
        <Select
          name="asistencia_feriado"
          selectedKeys={new Set([asistencia_feriado])}
          onChange={handleSelectChange}
          size="sm"
          radius="sm"
          classNames={selectUIClasses}
          aria-label="Asistencia Feriado"
        >
          {opcionesSiNo.map((op) => (
            <SelectItem key={op.key} textValue={op.label}>
              <p className="text-[9px]">{op.label}</p>
            </SelectItem>
          ))}
        </Select>
      </td>

      <td className={`${tdBlue} min-w-[70px]`}>
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

      {/* --- ENTRADA (Activa handleTimeBlur al salir) --- */}
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

      {/* --- SALIDA (Activa handleTimeBlur al salir) --- */}
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

      {/* --- CAMPOS AUTOMÁTICOS (Texto plano) --- */}
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
      {/* ----------------------------------------------------- */}

      <td className={`${tdBlue} min-w-[60px]`}>
        <Input
          type="number"
          step="0.01"
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
        <Input
          type="number"
          step="0.01"
          name="total_planilla"
          value={total_planilla || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Total Planilla"
        />
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
          type="number"
          step="0.01"
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
          type="number"
          step="0.01"
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
          type="number"
          step="0.01"
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
        <Input
          type="number"
          step="0.01"
          name="feriados"
          value={feriados || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Feriados (Cálculo)"
        />
      </td>

      {/* =========================================
          GRUPO 3: SUBTOTALES (ÁMBAR/AMARILLO)
          ========================================= */}

      <td className={`${tdYellow} min-w-[70px]`}>
        <Input
          type="number"
          step="0.01"
          name="salario"
          value={salario || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Salario"
        />
      </td>

      <td className={`${tdYellowLast} min-w-[70px]`}>
        <Input
          type="number"
          step="0.01"
          name="adicionales"
          value={adicionales || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Adicionales"
        />
      </td>
    </tr>
  );
};

export default TrAsistenciaAdministrativa;
