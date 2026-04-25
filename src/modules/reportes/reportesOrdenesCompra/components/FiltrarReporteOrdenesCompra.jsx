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
  validados,
  setValidados,
}) => {
  const handleSelectEstadoPago = (e) => {
    setEstadoPago(e.target.value);
  };

  const handleSelectValidados = (e) => {
    setValidados(e.target.value);
  };
  return (
    <form className="flex flex-col gap-2 px-2 items-start mt-2">
      <p className="text-sm">Filtrar por Fecha de Emision:</p>
      <div className="w-full flex gap-2 items-end">
        <Input
          className="w-[100%] max-w-[180px]"
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
          className="w-[100%] max-w-[180px] "
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
          className="w-[100%] max-w-[180px]"
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
        <Select
          className="w-[100%] max-w-[180px]"
          label="Validaddos"
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={[validados]}
          radius="sm"
          size="sm"
          onChange={handleSelectValidados}
          classNames={selectClassNames}
        >
          <SelectItem key="TODOS">TODOS</SelectItem>
          <SelectItem key="VALIDADOS">VALIDADOS</SelectItem>
          <SelectItem key="NO VALIDADOS">NO VALIDADOS</SelectItem>
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
