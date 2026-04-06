import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";

const FiltroVerificarCotizaciones = ({
  filtros,
  handleChangeFiltro,
  handleFindCotizaciones,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleFindCotizaciones();
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="w-full bg-white py-3 border-b-1 border-slate-200 flex gap-3 items-end flex-wrap z-10 relative"
    >
      <motion.div layout className="w-full sm:max-w-[200px] flex-1">
        <Select
          label="Filtrar por:"
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={[filtros.tipoFiltro]}
          radius="sm"
          size="sm"
          onChange={(e) => handleChangeFiltro("tipoFiltro", e.target.value)}
          classNames={selectClassNames}
          startContent={<FiFilter className="text-default-400" />}
        >
          <SelectItem key="Pagos">Pagos</SelectItem>
          <SelectItem key="Cotizaciones">Cotizaciones</SelectItem>
        </Select>
      </motion.div>

      {/* Inputs de Fecha (Corregidos a fecha_inicio y fecha_final) */}
      <motion.div layout className="flex gap-3 w-full sm:w-auto">
        <Input
          className="w-full sm:max-w-[180px]"
          classNames={inputClassNames}
          value={filtros.fecha_inicio}
          onChange={(e) => handleChangeFiltro("fecha_inicio", e.target.value)}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha inicial"
          radius="sm"
          size="sm"
        />
        <Input
          className="w-full sm:max-w-[180px]"
          classNames={inputClassNames}
          value={filtros.fecha_final}
          onChange={(e) => handleChangeFiltro("fecha_final", e.target.value)}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha final"
          radius="sm"
          size="sm"
        />
      </motion.div>

      {/* Selectores de Estado Condicionales */}
      {filtros.tipoFiltro === "Pagos" ? (
        <motion.div layout className="w-full sm:max-w-[160px] flex-1">
          <Select
            label="Estado"
            labelPlacement="outside"
            variant="bordered"
            selectedKeys={[filtros.estado_pago]}
            radius="sm"
            size="sm"
            onChange={(e) => handleChangeFiltro("estado_pago", e.target.value)}
            classNames={selectClassNames}
          >
            <SelectItem key="todos">Todos</SelectItem>
            <SelectItem key="Activo">Verificados</SelectItem>
            <SelectItem key="Anulado">No verificados</SelectItem>
          </Select>
        </motion.div>
      ) : (
        <motion.div layout className="w-full sm:max-w-[160px] flex-1">
          <Select
            label="Estado"
            labelPlacement="outside"
            variant="bordered"
            selectedKeys={[filtros.estado_cotizacion]}
            radius="sm"
            size="sm"
            onChange={(e) =>
              handleChangeFiltro("estado_cotizacion", e.target.value)
            }
            classNames={selectClassNames}
          >
            <SelectItem key="todos">Todos</SelectItem>
            <SelectItem key="Activo">Activo</SelectItem>
            <SelectItem key="Anulado">Anulado</SelectItem>
            <SelectItem key="Facturar">Facturar</SelectItem>
          </Select>
        </motion.div>
      )}

      <motion.div layout>
        <Button
          color="primary"
          type="submit"
          radius="sm"
          className="font-medium bg-slate-900 shadow-sm shadow-slate-900/30"
          startContent={<FiSearch className="text-lg" />}
        >
          Buscar
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default FiltroVerificarCotizaciones;
