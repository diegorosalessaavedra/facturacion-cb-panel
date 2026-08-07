import React, { useState, useEffect } from "react";
// 1. Importamos TODOS los componentes necesarios de NextUI
import { Button, Tooltip, Input, Select, SelectItem } from "@nextui-org/react";
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
    dia_plantilla: dia?.fecha || dia?.dia_plantilla || null,
    actividad_dia: "",
    goce_vacaciones: "NO",
    asistencia_feriado: "NO",
    autorizacion_entrada: "NO",
    autorizacion_salida: "NO",
    hora_entrada: "",
    hora_salida: "",
    horas_laboradas: "",
    tardanza_minutos: 0,
    estado: "PENDIENTE DE ENVIAR",
  });

  const handleAsistencia = () => {
    if (!dia?.id || !findColaborador?.id) return;
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/${dia.id}/${findColaborador.id}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data.asistencia) {
          const newData = { ...datosAsistencia, ...res.data.asistencia };
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

  // Para el Input de NextUI
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosAsistencia((prev) => ({ ...prev, [name]: value }));
  };

  // Para el Select de NextUI
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    // NextUI a veces devuelve el valor vacío si el usuario hace clic fuera, evitamos sobreescribir con vacío
    if (!value) return;

    const nuevosDatos = { ...datosAsistencia, [name]: value };
    setDatosAsistencia(nuevosDatos);
    handleSave(nuevosDatos);
  };

  const handleSave = (datosAEnviar = datosAsistencia) => {
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

    const toastId = toast.loading("Guardando...");
    const url = `${import.meta.env.VITE_URL_API}/asistencia-administrativo/${payload.id}`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Guardado", { id: toastId });

        const updatedData = { ...payload };
        if (res.data.data && res.data.data.id) {
          updatedData.id = res.data.data.id;
        }

        setDatosAsistencia(updatedData);
        setLastSavedData(updatedData);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al guardar", { id: toastId });
      });
  };

  // 2. ESTILOS CUSTOMIZADOS PARA NEXTUI EN TABLAS
  // Forzamos a que sean pequeños (h-[28px]) y transparentes hasta que se les haga focus o hover
  const inputUIClasses = {
    inputWrapper:
      "min-h-[25px] h-[25px] px-1 bg-transparent shadow-none hover:bg-slate-100 data-[focus=true]:bg-blue-50 transition-colors",
    input: "text-[10px] text-center text-slate-700",
  };

  const selectUIClasses = {
    trigger:
      "min-h-[25px] h-[25px] px-1 bg-transparent shadow-none hover:bg-slate-100 data-[open=true]:bg-blue-50 transition-colors",
    value: "text-[10px] text-center text-slate-700",
  };

  const {
    actividad_dia,
    goce_vacaciones,
    asistencia_feriado,
    autorizacion_entrada,
    autorizacion_salida,
    hora_entrada,
    hora_salida,
    horas_laboradas,
    tardanza_minutos,
    estado,
  } = datosAsistencia;

  // Las opciones de SI/NO se repiten mucho, las guardamos en un arreglo para mapearlas
  const opcionesSiNo = [
    { key: "NO", label: "NO" },
    { key: "SI", label: "SI" },
  ];

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
      <td className="border-r border-slate-100 bg-white p-2 font-semibold text-slate-800 uppercase text-[9px] whitespace-nowrap">
        {findColaborador?.nombre_colaborador || "-"}{" "}
        {findColaborador?.apellidos_colaborador || "-"}
      </td>

      <td className="border-r border-slate-100 bg-white p-2 font-medium text-slate-600 uppercase text-[9px] whitespace-nowrap">
        {formatDateES(dia.dia_plantilla || dia.fecha)}
      </td>

      <td className="border-r border-slate-100 bg-white p-1 min-w-[140px]">
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
          aria-label="Actividad del día"
        />
      </td>

      <td className="border-r border-slate-100 bg-white p-1">
        <Select
          name="goce_vacaciones"
          selectedKeys={new Set([goce_vacaciones])} // NextUI requiere 'Set'
          onChange={handleSelectChange}
          size="sm"
          radius="sm"
          classNames={selectUIClasses}
          aria-label="Goce vacaciones"
        >
          {opcionesSiNo.map((op) => (
            <SelectItem key={op.key} textValue={op.label}>
              <p className="text-[9px]">{op.label}</p>
            </SelectItem>
          ))}
        </Select>
      </td>

      <td className="border-r border-slate-100 bg-white p-1">
        <Select
          name="asistencia_feriado"
          selectedKeys={new Set([asistencia_feriado])}
          onChange={handleSelectChange}
          size="sm"
          radius="sm"
          classNames={selectUIClasses}
          aria-label="Asistencia feriado"
        >
          {opcionesSiNo.map((op) => (
            <SelectItem key={op.key} textValue={op.label}>
              <p className="text-[9px]">{op.label}</p>
            </SelectItem>
          ))}
        </Select>
      </td>

      <td className="border-r border-slate-100 bg-white p-1">
        <Select
          name="autorizacion_entrada"
          selectedKeys={new Set([autorizacion_entrada])}
          onChange={handleSelectChange}
          size="sm"
          radius="sm"
          classNames={selectUIClasses}
          aria-label="Autorización entrada"
        >
          {opcionesSiNo.map((op) => (
            <SelectItem key={op.key} textValue={op.label}>
              <p className="text-[9px]">{op.label}</p>
            </SelectItem>
          ))}
        </Select>
      </td>

      <td className="border-r border-slate-100 bg-white p-1">
        <Select
          name="autorizacion_salida"
          selectedKeys={new Set([autorizacion_salida])}
          onChange={handleSelectChange}
          size="sm"
          radius="sm"
          classNames={selectUIClasses}
          aria-label="Autorización salida"
        >
          {opcionesSiNo.map((op) => (
            <SelectItem key={op.key} textValue={op.label}>
              <p className="text-[9px]">{op.label}</p>
            </SelectItem>
          ))}
        </Select>
      </td>

      <td className="border-r border-slate-100 bg-white p-1 min-w-[90px]">
        <Input
          type="time"
          name="hora_entrada"
          value={hora_entrada || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Hora entrada"
        />
      </td>

      <td className="border-r border-slate-100 bg-white p-1 min-w-[90px]">
        <Input
          type="time"
          name="hora_salida"
          value={hora_salida || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Hora salida"
        />
      </td>

      <td className="border-r border-slate-100 bg-white p-1 min-w-[70px]">
        <Input
          type="number"
          step="0.01"
          name="horas_laboradas"
          value={horas_laboradas || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Horas laboradas"
        />
      </td>

      <td className="border-r border-slate-100 bg-white p-1 min-w-[70px]">
        <Input
          type="number"
          name="tardanza_minutos"
          value={tardanza_minutos || ""}
          onChange={handleChange}
          onBlur={() => handleSave()}
          size="sm"
          radius="sm"
          classNames={inputUIClasses}
          aria-label="Tardanza minutos"
        />
      </td>

      <td className="border-r border-slate-100 bg-white p-2 text-center">
        <span
          className={`px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap ${estado === "PENDIENTE DE ENVIAR" ? "bg-warning-100 text-warning-700" : "bg-success-100 text-success-700"}`}
        >
          {estado}
        </span>
      </td>

      <td className="p-2 text-center bg-white">
        <Button
          size="sm"
          color="primary"
          variant="light"
          onPress={() => handleSave()}
          className="text-[10px] h-[28px] min-w-max px-2 "
        >
          Guardar
        </Button>
      </td>
    </tr>
  );
};

export default TrAsistenciaAdministrativa;
