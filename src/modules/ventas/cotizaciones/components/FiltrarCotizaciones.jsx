import React from "react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";

const FiltrarCotizaciones = ({
  selectFiltro,
  setSelectFiltro,
  dataFiltro,
  setDataFiltro,
  handleFindCotizaciones,
  inicioFecha,
  setInicioFecha,
  finalFecha,
  setFinalFecha,
  setEstadoCotizacion,
  estadoCotizacion,
}) => {
  const handleSelectFiltro = (e) => {
    setSelectFiltro(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFindCotizaciones();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 px-2 items-end flex-wrap"
    >
      {/* Select principal */}
      <Select
        className="w-[100%] max-w-[200px]"
        label="Filtrar por:"
        labelPlacement="outside"
        variant="bordered"
        selectedKeys={[selectFiltro]}
        radius="sm"
        size="sm"
        onChange={handleSelectFiltro}
        classNames={selectClassNames}
      >
        <SelectItem key="cliente">Cliente</SelectItem>
        <SelectItem key="fechaEmision">Fecha de Emisión</SelectItem>
        <SelectItem key="fechaEntrega">Fecha de Entrega</SelectItem>
        <SelectItem key="vendedor">Vendedor</SelectItem>
      </Select>

      {/* Filtros por fecha */}
      {(selectFiltro === "fechaEmision" || selectFiltro === "fechaEntrega") && (
        <>
          <Input
            className="w-[100%] max-w-[200px]"
            classNames={inputClassNames}
            value={inicioFecha}
            onChange={(e) => setInicioFecha(e.target.value)}
            labelPlacement="outside"
            type="date"
            variant="bordered"
            label="Fecha inicial"
            radius="sm"
            size="sm"
          />
          <Input
            className="w-[100%] max-w-[200px]"
            classNames={inputClassNames}
            value={finalFecha}
            onChange={(e) => setFinalFecha(e.target.value)}
            labelPlacement="outside"
            type="date"
            variant="bordered"
            label="Fecha final"
            radius="sm"
            size="sm"
          />
        </>
      )}

      {/* Input de texto general */}
      {selectFiltro !== "estado" &&
        selectFiltro !== "fechaEmision" &&
        selectFiltro !== "fechaEntrega" && (
          <Input
            className="w-[100%] max-w-[200px]"
            classNames={inputClassNames}
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="Datos"
            radius="sm"
            size="sm"
          />
        )}

      {/* Select de estado */}
      <Select
        className="w-[100%] max-w-[200px]"
        label="Estado"
        labelPlacement="outside"
        variant="bordered"
        selectedKeys={[estadoCotizacion]}
        radius="sm"
        size="sm"
        onChange={(e) => setEstadoCotizacion(e.target.value)}
        classNames={selectClassNames}
      >
        <SelectItem key="todos">Todos</SelectItem>
        <SelectItem key="Activo">Activo</SelectItem>
        <SelectItem key="Anulado">Anulado</SelectItem>
        <SelectItem key="Facturar">Facturar</SelectItem>
      </Select>

      <Button color="primary" type="submit">
        Filtrar
      </Button>
    </form>
  );
};

export default FiltrarCotizaciones;
