import React from "react";
import { inputClassNames, selectClassNames } from "../../../assets/classNames";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { div } from "framer-motion/client";

const FiltrarOrdenesCompra = ({
  selectFiltro,
  setSelectFiltro,
  dataFiltro,
  setDataFiltro,
  handleFindOrdenCompras,
  inicioFecha,
  setInicioFecha,
  finalFecha,
  setFinalFecha,
  setEstadoPago,
  estadoPago,
  txtSolpeds,
}) => {
  const handleSelectFiltro = (e) => {
    setSelectFiltro(e.target.value);
  };
  const handleSelectEstadoPago = (e) => {
    setEstadoPago(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFindOrdenCompras();
  };

  const sumaTotal = txtSolpeds.reduce(
    (suma, solped) => suma + Number(solped.monto_txt || 0),
    0 // 👈 valor inicial
  );

  return (
    <section className="w-full flex gap-10 justify-between items-end px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full flex gap-2 px-2 items-end"
      >
        <Select
          className="w-[100%] max-w-[300px]"
          label="Filtrar por: "
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={[selectFiltro]}
          radius="sm"
          size="sm"
          onChange={handleSelectFiltro}
          classNames={selectClassNames}
        >
          <SelectItem key="proveedor">Proveedor</SelectItem>
          <SelectItem key="fechaEmision">Fecha de Emisión</SelectItem>
          <SelectItem key="fechaVencimiento">Fecha de Vencimiento</SelectItem>
          <SelectItem key="comprador">Comprador</SelectItem>
        </Select>

        {(selectFiltro === "fechaEmision" ||
          selectFiltro === "fechaVencimiento") && (
          <Input
            className="w-[100%] max-w-[300px]"
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
            className="w-[100%] max-w-[300px]"
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
            className="w-[100%] max-w-[300px]"
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
          <SelectItem key="ANTICIPO">ANTICIPO</SelectItem>
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
