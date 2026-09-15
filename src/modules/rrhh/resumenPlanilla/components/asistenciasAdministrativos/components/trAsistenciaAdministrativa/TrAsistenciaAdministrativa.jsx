import React, { useState, useEffect, useRef } from "react";
import { Select, SelectItem, Input, useDisclosure, Tooltip } from "@nextui-org/react";
import { formatDateES, formatToPeruTime } from "../../../../../../../utils/formatDateTime";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import { toast } from "sonner";
import { onInputNumber, onInputPrice } from "../../../../../../../assets/onInputs";
import EditTimeModal from "./EditTimeModal"; 

const TrAsistenciaAdministrativa = ({
  dia,
  findColaborador,
  sueldoPorDia,
  sueldoFeriadoBruto,
  onDataUpdate,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [lastSavedData, setLastSavedData] = useState(null);

  const esFeriado = Boolean(dia?.bonificacion_feriado);
  const valorAsistenciaFeriado = esFeriado ? "SI" : "NO";
  const valorMontoFeriado = esFeriado ? sueldoFeriadoBruto || 0.0 : 0.0;

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

  const [datosAsistencia, setDatosAsistencia] = useState(() =>
    aplicarReglasTurno({
      id: null,
      dia_planilla_id: dia?.id || null,
      semana_planilla_id: dia?.semana_plantilla_id || dia?.semana_planilla_id || null,
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

  useEffect(() => {
    if (!dia?.id || !findColaborador?.id) return;
    
    const urlAdmin = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/${dia.id}/${findColaborador.id}`;
    
    axios.get(urlAdmin, config).then((res) => {
      if (res.data.asistencia) {
        const { calculo_asistencia_administrativo, ...datosPrincipales } = res.data.asistencia;
        const newData = aplicarReglasTurno({
          ...datosAsistencia,
          ...datosPrincipales,
          ...(calculo_asistencia_administrativo || {}),
        });

        setDatosAsistencia(newData);
        setLastSavedData(newData);
        if (onDataUpdate) onDataUpdate(newData);

        if (!newData.hora_entrada || !newData.hora_salida) {
          fetchHuelleroData(newData);
        }
      } else {
        fetchHuelleroData(datosAsistencia);
      }
    }).catch(err => console.error("Error al cargar asistencia:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHuelleroData = (currentData) => {
    if (!dia?.dia_plantilla || !findColaborador?.dni_colaborador) return;
    const url = `${import.meta.env.VITE_URL_API}/asistencia-huellero?fecha=${dia.dia_plantilla}&dni=${findColaborador.dni_colaborador}`;
    
    axios.get(url, config).then((res) => {
      if (res.data?.asistencias) {
        const { entrada, salida } = res.data.asistencias;
        const hEntrada = formatToPeruTime(entrada?.punch_time);
        const hSalida = formatToPeruTime(salida?.punch_time);

        if (hEntrada || hSalida) {
          const calculos = calcularTiempos(hEntrada, hSalida);
          const newData = aplicarReglasTurno({
            ...currentData,
            hora_entrada: hEntrada || currentData.hora_entrada,
            hora_salida: hSalida || currentData.hora_salida,
            ...calculos,
          });
          
          setDatosAsistencia(newData);
          if (onDataUpdate) onDataUpdate(newData);
          handleSave(newData); 
        }
      }
    }).catch(err => console.error("Error huellero:", err));
  };

  // RESTAURADA TU VERSIÓN ORIGINAL QUE FUNCIONABA PERFECTAMENTE CON EL ONBLUR
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
    const nuevosDatos = aplicarReglasTurno({ ...datosAsistencia, [name]: value });
    datosRef.current = nuevosDatos;
    setDatosAsistencia(nuevosDatos);
    if (onDataUpdate) onDataUpdate(nuevosDatos);
    handleSave(nuevosDatos);
  };

  const handleConfirmarEdicionTiempo = (nuevaEntrada, nuevaSalida, motivo) => {
    const calculos = calcularTiempos(nuevaEntrada, nuevaSalida);
    const nuevosDatos = aplicarReglasTurno({
      ...datosAsistencia,
      peticion_entrada_salida: {
        entrada: nuevaEntrada,
        salida: nuevaSalida,
        motivo: motivo,
        estado: 'pendiente'
      },
      ...calculos,
    });

    datosRef.current = nuevosDatos;
    setDatosAsistencia(nuevosDatos);
    if (onDataUpdate) onDataUpdate(nuevosDatos);
    handleSave(nuevosDatos);
  };

  const calcularTiempos = (entrada, salida) => {
    let tardanza_minutos = 0, total_horas_minutos = "", horas_enteras = 0, minutos_enteros = 0;
    if (entrada) {
      const [entHora, entMin] = entrada.split(":").map(Number);
      const entTotalMinutos = entHora * 60 + entMin;
      tardanza_minutos = Math.max(0, entTotalMinutos - (9 * 60));

      if (salida) {
        const [salHora, salMin] = salida.split(":").map(Number);
        let diffMinutos = (salHora * 60 + salMin) - entTotalMinutos;
        if (diffMinutos < 0) diffMinutos += 24 * 60;
        diffMinutos = Math.max(0, diffMinutos - 60); 
        horas_enteras = Math.floor(diffMinutos / 60);
        minutos_enteros = diffMinutos % 60;
        total_horas_minutos = `${String(horas_enteras).padStart(2, "0")}:${String(minutos_enteros).padStart(2, "0")}`;
      }
    }
    return { tardanza_minutos, total_horas_minutos, horas_enteras, minutos_enteros };
  };

  const handleSave = (datosAEnviar = datosRef.current) => {
    const payload = { ...datosAEnviar };
    for (const key in payload) {
      if (payload[key] === "") payload[key] = null;
    }
    
    const mySeq = ++saveSeqRef.current;
    const toastId = toast.loading("Guardando...");
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/${payload.id || "0"}`;

    axios.post(url, payload, config).then((res) => {
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
    }).catch((err) => {
      console.error(err);
      toast.error("Error al guardar", { id: toastId });
    });
  };

  const inputUIClasses = {
    inputWrapper: "min-h-[25px] h-[25px] px-1 bg-white shadow-sm border border-slate-200 hover:bg-white/90 data-[focus=true]:bg-white data-[focus=true]:shadow-md transition-all",
    input: "text-[10px] text-center text-slate-700 font-medium",
  };
  const selectUIClasses = {
    trigger: "min-h-[25px] h-[25px] px-1 bg-white shadow-sm border border-slate-200 hover:bg-white/90 data-[open=true]:bg-white data-[open=true]:shadow-md transition-all",
    value: "text-[10px] text-center text-slate-700 font-medium",
  };
  
  const readOnlyTextClass = "min-h-[25px] h-[25px] w-full flex items-center justify-center text-[10px] font-bold rounded-sm px-1";
  const tdBlue = "border-r border-b border-blue-200 bg-blue-50/80 p-1 relative";
  const tdGreen = "border-r border-b border-teal-200 bg-teal-50/80 p-1";
  const tdYellow = "border-r border-b border-amber-200 bg-amber-50/80 p-1";

  const {
    asistencia_feriado, goce_vacaciones, turno, actividad_dia, hora_entrada, hora_salida, peticion_entrada_salida,
    tardanza_minutos, total_horas_minutos, horas_enteras, minutos_enteros, turnos,
    total_planilla, hr_min_extra, importe_horas, importe_minutos, bono, feriados, salario, adicionales,
  } = datosAsistencia;

  const estadoPeticion = peticion_entrada_salida?.estado;
  const mostrarEntrada = peticion_entrada_salida ? peticion_entrada_salida.entrada : hora_entrada;
  const mostrarSalida = peticion_entrada_salida ? peticion_entrada_salida.salida : hora_salida;

  const getDynamicTimeClass = () => {
    if (estadoPeticion === 'pendiente') return "bg-amber-100 text-amber-700 border border-amber-300"; 
    if (estadoPeticion === 'aprobado') return "bg-sky-100 text-sky-700 border border-sky-300"; 
    if (hora_entrada || hora_salida) return "bg-emerald-100 text-emerald-700 border border-emerald-300"; 
    return "text-slate-600 bg-transparent"; 
  };

  const getTooltipMessage = () => {
    if (estadoPeticion === 'pendiente') return "Edición pendiente de aprobación";
    if (estadoPeticion === 'aprobado') return "Edición manual aprobada";
    return "Dato biométrico original. Clic para editar";
  };

  return (
    <>
      <tr className="group hover:bg-slate-50 transition-colors">
        <td className={`${tdBlue} uppercase text-[9px] whitespace-nowrap align-middle min-w-[180px]`}>
          {formatDateES(dia?.dia_plantilla) || "-"}
        </td>
        <td className={`${tdBlue} min-w-[70px]`}><div className={`${readOnlyTextClass} text-slate-600`}>{asistencia_feriado}</div></td>
        <td className={`${tdBlue} min-w-[150px]`}>
          <Select name="goce_vacaciones" selectedKeys={new Set([goce_vacaciones])} onChange={handleSelectChange} size="sm" classNames={selectUIClasses}>
            {[{ key: "NO", label: "NO" }, { key: "SI", label: "SI" }].map(op => <SelectItem key={op.key} textValue={op.label}><p className="text-[9px]">{op.label}</p></SelectItem>)}
          </Select>
        </td>
        <td className={`${tdBlue} min-w-[100px]`}>
          <Select name="turno" selectedKeys={new Set([turno])} onChange={handleSelectChange} size="sm" classNames={selectUIClasses}>
            {["DIURNO", "NOCTURNO", "NOCTURNO ALTO", "VIAJES"].map(t => <SelectItem key={t} textValue={t}><p className="text-[9px]">{t}</p></SelectItem>)}
          </Select>
        </td>
        <td className={`${tdBlue} min-w-[120px]`}>
          <Input type="text" name="actividad_dia" value={actividad_dia || ""} onChange={handleChange} onBlur={() => handleSave()} placeholder="..." size="sm" classNames={inputUIClasses} />
        </td>

        <td className={`${tdBlue} min-w-[80px] hover:brightness-95 transition cursor-pointer`} onClick={onOpen}>
          <Tooltip content={getTooltipMessage()} delay={300} placement="top">
            <div className={`${readOnlyTextClass} ${getDynamicTimeClass()}`}>{mostrarEntrada || "-"}</div>
          </Tooltip>
        </td>
        <td className={`${tdBlue} min-w-[80px] hover:brightness-95 transition cursor-pointer`} onClick={onOpen}>
          <Tooltip content={getTooltipMessage()} delay={300} placement="top">
            <div className={`${readOnlyTextClass} ${getDynamicTimeClass()}`}>{mostrarSalida || "-"}</div>
          </Tooltip>
        </td>

        <td className={`${tdBlue} min-w-[60px]`}><div className={`${readOnlyTextClass} text-slate-600`}>{tardanza_minutos || "0"}</div></td>
        <td className={`${tdBlue} min-w-[80px]`}><div className={`${readOnlyTextClass} text-slate-600`}>{total_horas_minutos || "-"}</div></td>
        <td className={`${tdBlue} min-w-[60px]`}><div className={`${readOnlyTextClass} text-slate-600`}>{horas_enteras || "0"}</div></td>
        <td className={`${tdBlue} min-w-[60px]`}><div className={`${readOnlyTextClass} text-slate-600`}>{minutos_enteros || "0"}</div></td>
        <td className={`${tdBlue} min-w-[60px]`}>
          <Input type="text" onInput={onInputNumber} name="turnos" value={turnos || ""} onChange={handleChange} onBlur={() => handleSave()} size="sm" classNames={inputUIClasses} />
        </td>
        
        <td className={`${tdGreen} min-w-[70px]`}><div className={`${readOnlyTextClass} text-slate-600`}>{Number(total_planilla || 0).toFixed(2)}</div></td>
        
        <td className={`${tdGreen} min-w-[80px]`}>
          <div className={`${readOnlyTextClass} text-slate-600`}>{hr_min_extra || "-"}</div>
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <div className={`${readOnlyTextClass} text-slate-600`}>{Number(importe_horas || 0).toFixed(2)}</div>
        </td>
        <td className={`${tdGreen} min-w-[70px]`}>
          <div className={`${readOnlyTextClass} text-slate-600`}>{Number(importe_minutos || 0).toFixed(2)}</div>
        </td>

        <td className={`${tdGreen} min-w-[70px]`}>
          <Input type="text" onInput={onInputPrice} name="bono" value={bono || ""} onChange={handleChange} onBlur={() => handleSave()} size="sm" classNames={inputUIClasses} />
        </td>
        <td className={`${tdGreen} min-w-[70px]`}><div className={`${readOnlyTextClass} text-slate-600`}>{Number(feriados || 0).toFixed(2)}</div></td>
        <td className={`${tdYellow} min-w-[70px]`}><div className={`${readOnlyTextClass} text-slate-600`}>{Number(salario || 0).toFixed(2)}</div></td>
        <td className={`${tdYellow} min-w-[70px] border-r-0`}><div className={`${readOnlyTextClass} text-slate-600`}>{Number(adicionales || 0).toFixed(2)}</div></td>
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