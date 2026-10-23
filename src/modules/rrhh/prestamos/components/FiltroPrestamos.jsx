import React from "react";
import { Select, SelectItem, Input, Button } from "@nextui-org/react";
import { selectClassNames, inputClassNames } from "../../../../assets/classNames";

const FiltroPrestamos = ({
  filtroEstado,
  setFiltroEstado,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  onBuscar, // <-- Prop para ejecutar la búsqueda (opcional)
}) => {
  const estados = [
    { id: "TODOS", nombre: "Todos" },
    { id: "PENDIENTE", nombre: "Pendiente" },
    { id: "AUTORIZADO", nombre: "Autorizado" },
    { id: "RECHAZADO", nombre: "Rechazado" },
  ];

  return (
    <section className="flex flex-col mt-4">
      <div className="mb-2">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          Filtros de Búsqueda
        </h2>
      </div>
      <div className="flex flex-wrap gap-4 items-end">
        
        {/* FILTRO POR ESTADO */}
        <Select
          className="w-48"
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Estado"
          placeholder="Seleccione..."
          variant="bordered"
          radius="sm"
          size="sm"
          selectedKeys={filtroEstado ? new Set([filtroEstado]) : new Set(["TODOS"])}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          {estados.map((est) => (
            <SelectItem key={est.id} textValue={est.nombre}>
              {est.nombre}
            </SelectItem>
          ))}
        </Select>

        {/* FILTRO FECHA INICIO */}
        <Input
          type="date"
          className="w-40"
          classNames={inputClassNames}
          labelPlacement="outside"
          label="Fecha Inicio"
          variant="bordered"
          radius="sm"
          size="sm"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />

        {/* FILTRO FECHA FIN */}
        <Input
          type="date"
          className="w-40"
          classNames={inputClassNames}
          labelPlacement="outside"
          label="Fecha Fin"
          variant="bordered"
          radius="sm"
          size="sm"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
        
        {/* BOTÓN DE BUSCAR */}
        <Button
          className="bg-slate-900  text-slate-50 font-bold h-10 px-4"
          size="sm"
          onPress={onBuscar}
        >
          FILTRAR
        </Button>
        
      </div>
    </section>
  );
};

export default FiltroPrestamos;