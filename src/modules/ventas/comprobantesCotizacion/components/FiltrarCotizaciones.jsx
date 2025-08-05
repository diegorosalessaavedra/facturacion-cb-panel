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
}) => {
  const handleSelectFiltro = (e) => {
    setSelectFiltro(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFindCotizaciones();
  };

  return (
    <form onSubmit={handleSubmit} className=" flex gap-2 px-2 items-end">
      <Select
        className="w-60"
        label="Filtrar por: "
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
        <SelectItem key="fechaVencimiento">Fecha de Vencimiento</SelectItem>
        <SelectItem key="vendedor">Vendedor</SelectItem>
      </Select>

      {(selectFiltro === "fechaEmision" ||
        selectFiltro === "fechaVencimiento") && (
        <Input
          className="w-36"
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
      )}

      {selectFiltro === "fechaEmision" ||
      selectFiltro === "fechaVencimiento" ? (
        <Input
          className="w-36"
          classNames={inputClassNames}
          value={finalFecha}
          onChange={(e) => setFinalFecha(e.target.value)}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha Final"
          radius="sm"
          size="sm"
        />
      ) : (
        <Input
          className="w-36"
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

      <Button color="primary" type="submit">
        Filtrar
      </Button>
    </form>
  );
};

export default FiltrarCotizaciones;
