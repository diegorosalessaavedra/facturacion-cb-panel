import React from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { FiPlus } from "react-icons/fi";

const CalendarioHeader = ({
  aniosDisponibles,
  anioSeleccionado,
  setAnioSeleccionado,
  onOpenModal,
}) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Gestión de Planillas{" "}
          {anioSeleccionado ? (
            <span className="text-amber-600"> {anioSeleccionado}</span>
          ) : (
            ""
          )}
        </h1>
        <p className="text-slate-500 text-sm">
          Administración de periodos laborables y feriados
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          aria-label="Seleccionar Año"
          placeholder="Filtrar Año"
          selectedKeys={anioSeleccionado ? [anioSeleccionado.toString()] : []}
          onChange={(e) => setAnioSeleccionado(e.target.value)}
          className="w-32"
          size="sm"
          variant="faded"
        >
          {aniosDisponibles.map((a) => (
            <SelectItem key={a.year} value={a.year.toString()}>
              {a.year.toString()}
            </SelectItem>
          ))}
        </Select>

        <Button
          size="sm"
          radius="sm"
          className="bg-slate-900 text-white font-medium"
          startContent={<FiPlus />}
          onPress={() => onOpenModal("agregar_year", {})}
        >
          Crear Año
        </Button>
        <Button
          size="sm"
          radius="sm"
          className="bg-amber-100 text-amber-700 hover:bg-amber-200 font-medium"
          startContent={<FiPlus />}
          onPress={() =>
            onOpenModal("agregar_mes", { year_planilla_id: anioSeleccionado })
          }
        >
          Agregar Mes
        </Button>
      </div>
    </header>
  );
};

export default CalendarioHeader;
