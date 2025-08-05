import { Input, Button } from "@nextui-org/react";
import { inputClassNames } from "../../../../assets/classNames";
import ExcelKardex from "../../../../assets/exelKardex";

const FiltroReporteKardex = ({
  productos,
  fechaInicio,
  setFechaInicio,
  fechaFinal,
  setFechaFinal,
  handleFindProductos,
}) => {
  return (
    <div className="w-full px-4 flex items-end justify-between">
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
        <Button
          onClick={() => handleFindProductos()}
          color="primary"
          type="submit"
          size="md"
        >
          Filtrar
        </Button>
      </div>
      <Button
        color="danger"
        onClick={() =>
          ExcelKardex.exportToExcel(productos, fechaInicio, fechaFinal)
        }
      >
        Descargar
      </Button>
    </div>
  );
};

export default FiltroReporteKardex;
