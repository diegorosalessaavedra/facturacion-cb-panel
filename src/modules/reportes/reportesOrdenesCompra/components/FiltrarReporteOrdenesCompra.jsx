import React from "react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";

const FiltrarReporteOrdenesCompra = ({
  fechaInicio,
  setFechaInicio,
  fechaFinal,
  setFechaFinal,
  handleFindoOrdenesCompra,
  setEstadoPago,
  estadoPago,
}) => {
  const handleSelectEstadoPago = (e) => {
    setEstadoPago(e.target.value);
  };
  return (
    <form className="flex flex-col gap-2 px-2 items-start mt-2">
      <p className="text-sm">Filtrar por Fecha de Emision:</p>
      <div className="w-full flex gap-2 items-end">
        <Input
          className="w-[100%] max-w-[300px]"
          classNames={inputClassNames}
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha de Inicio"
          id="fechaFinal"
          radius="sm"
          size="sm"
        />
        <Input
          className="w-[100%] max-w-[300px] "
          classNames={inputClassNames}
          value={fechaFinal}
          onChange={(e) => setFechaFinal(e.target.value)}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha de Final"
          id="fechaInicio"
          radius="sm"
          size="sm"
        />
        <Select
          className="w-[100%] max-w-[300px]"
          label="Estado de pago "
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={[estadoPago]}
          radius="sm"
          size="sm"
          onChange={handleSelectEstadoPago}
          classNames={selectClassNames}
        >
          <SelectItem key="TODOS">TODOS</SelectItem>
          <SelectItem key="PENDIENTE">PENDIENTE</SelectItem>
          <SelectItem key="CANCELADO">CANCELADO</SelectItem>
        </Select>
        <Button
          onPress={() => handleFindoOrdenesCompra()}
          color="primary"
          size="md"
        >
          Filtrar
        </Button>
      </div>
    </form>
  );
};

export default FiltrarReporteOrdenesCompra;
