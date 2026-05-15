import React from "react";
import { inputClassNames, selectClassNames } from "../../../assets/classNames";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";

const FiltrarOrdenesCompra = ({
  filtros,
  setFiltros,
  handleFindOrdenCompras,
  txtSolpeds,
}) => {
  // Función unificada para manejar cambios en Inputs (texto, fechas)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función específica para el Select de NextUI
  const handleSelectEstadoPago = (e) => {
    setFiltros((prev) => ({
      ...prev,
      estado_pago: e.target.value,
    }));
  };

  const handleSelectSaldo = (e) => {
    setFiltros((prev) => ({
      ...prev,
      estado_saldo_proveedor: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFindOrdenCompras();
  };

  const sumaTotal = txtSolpeds.reduce(
    (suma, solped) => suma + Number(solped.monto_txt || 0),
    0,
  );

  return (
    <section className="w-full flex gap-10 justify-between items-end px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full flex gap-2 px-2 items-end"
      >
        <Input
          name="proveedor"
          value={filtros.proveedor}
          onChange={handleChange}
          className="w-[100%] max-w-[300px]"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Datos Proveedor"
          radius="sm"
          size="sm"
        />

        <Input
          name="fecha_inicio"
          value={filtros.fecha_inicio}
          onChange={handleChange}
          className="w-[100%] max-w-[300px]"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha inicial"
          radius="sm"
          size="sm"
        />

        <Input
          name="fecha_final"
          value={filtros.fecha_final}
          onChange={handleChange}
          className="w-[100%] max-w-[300px]"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha Final"
          radius="sm"
          size="sm"
        />

        <Select
          className="w-[100%] max-w-[300px]"
          label="Estado de Pago SOLPED"
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={[filtros.estado_pago]} // Vinculado al estado global
          radius="sm"
          size="sm"
          onChange={handleSelectEstadoPago}
          classNames={selectClassNames}
        >
          <SelectItem key="Todos">TODOS</SelectItem>
          <SelectItem key="PENDIENTE">PENDIENTE</SelectItem>
          <SelectItem key="CANCELADO">CANCELADO</SelectItem>
          <SelectItem key="ANTICIPO">ANTICIPO</SelectItem>
          <SelectItem key="ENVIADO A PAGO">ENVIADO A PAGO</SelectItem>
          <SelectItem key="ANULADO">ANULADO</SelectItem>
        </Select>
        <Select
          className="w-[100%] max-w-[300px]"
          label="Estado Saldo Proveedor"
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={[filtros.estado_saldo_proveedor]} // Vinculado al estado global
          radius="sm"
          size="sm"
          onChange={handleSelectSaldo}
          classNames={selectClassNames}
        >
          <SelectItem key="Todos">TODOS</SelectItem>
          <SelectItem key="DEBE">DEBE</SelectItem>
          <SelectItem key="A FAVOR">A FAVOR</SelectItem>
          <SelectItem key="SALDO CERO">SALDO CERO</SelectItem>
        </Select>

        <Button color="primary" type="submit">
          Filtrar
        </Button>
      </form>

      <div className="flex text-nowrap gap-4 text-sm font-semibold text-center pr-4">
        <article>
          <p className="text-nowrap">Total</p>
          <span className="text-blue-500">{txtSolpeds.length}</span>
        </article>
        <article>
          <p>Suma</p>
          <span className="text-blue-500">
            {" "}
            S/{" "}
            {Number(sumaTotal).toLocaleString("es-PE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </article>
      </div>
    </section>
  );
};

export default FiltrarOrdenesCompra;
