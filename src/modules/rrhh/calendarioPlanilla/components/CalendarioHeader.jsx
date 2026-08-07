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
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full bg-slate-900 border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-6 relative z-10">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img
            className="w-12 h-12 object-contain"
            src="/logo.jpg"
            alt="logo"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-50 tracking-tight flex items-center gap-2">
            Gestión de Planillas{" "}
            {anioSeleccionado ? (
              <span className="text-amber-500"> {anioSeleccionado}</span>
            ) : (
              ""
            )}
          </h1>
          <p className="text-slate-200 text-sm">
            Administración de periodos laborables y feriados
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          aria-label="Seleccionar Año"
          placeholder="Filtrar Año"
          selectedKeys={anioSeleccionado ? [anioSeleccionado] : []}
          onChange={(e) => setAnioSeleccionado(e.target.value)}
          className="w-32"
          size="sm"
          variant="faded"
        >
          {aniosDisponibles.map((a) => (
            <SelectItem key={a.id} textValue={a.year}>
              {a.year}
            </SelectItem>
          ))}
        </Select>

        <Button
          size="sm"
          radius="sm"
          className="bg-green-500 text-slate-900 font-medium"
          startContent={<FiPlus />}
          onPress={() => onOpenModal("agregar_year", {})}
        >
          Crear Año
        </Button>
        <Button
          size="sm"
          radius="sm"
          className="bg-amber-500 text-slate-900 font-medium"
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
