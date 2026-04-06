import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";

const FiltrarCotizaciones = ({
  filtros,
  handleChangeFiltro,
  handleFindCotizaciones,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleFindCotizaciones();
  };

  const fadeSlideVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.95 },
  };

  const getPlaceholder = () => {
    if (filtros.tipoFiltro === "cliente") return "Ej. Juan Pérez...";
    if (filtros.tipoFiltro === "vendedor") return "Ej. Ana López...";
    return "Escribe aquí...";
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="w-full bg-white  py-3 border-b-1 border-slate-400 shadow-sm flex gap-3 items-end flex-wrap z-10 relative "
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
          <SelectItem key="cliente">Cliente</SelectItem>
          <SelectItem key="fechaEmision">Fecha de Emisión</SelectItem>
          <SelectItem key="fechaEntrega">Fecha de Entrega</SelectItem>
          <SelectItem key="vendedor">Vendedor</SelectItem>
        </Select>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {(filtros.tipoFiltro === "fechaEmision" ||
          filtros.tipoFiltro === "fechaEntrega") && (
          <motion.div
            key="date-filters"
            layout
            variants={fadeSlideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex gap-3 w-full sm:w-auto"
          >
            <Input
              className="w-full sm:max-w-[180px]"
              classNames={inputClassNames}
              value={filtros.inicioFecha}
              onChange={(e) =>
                handleChangeFiltro("inicioFecha", e.target.value)
              }
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
              value={filtros.finalFecha}
              onChange={(e) => handleChangeFiltro("finalFecha", e.target.value)}
              labelPlacement="outside"
              type="date"
              variant="bordered"
              label="Fecha final"
              radius="sm"
              size="sm"
            />
          </motion.div>
        )}

        {filtros.tipoFiltro !== "estado" &&
          filtros.tipoFiltro !== "fechaEmision" &&
          filtros.tipoFiltro !== "fechaEntrega" && (
            <motion.div
              key="text-filter"
              layout
              variants={fadeSlideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="w-full sm:max-w-[220px] flex-1"
            >
              <Input
                classNames={inputClassNames}
                value={filtros.dataFiltro}
                onChange={(e) =>
                  handleChangeFiltro("dataFiltro", e.target.value)
                }
                labelPlacement="outside"
                type="text"
                variant="bordered"
                label="Datos de búsqueda"
                placeholder={getPlaceholder()}
                radius="sm"
                size="sm"
              />
            </motion.div>
          )}
      </AnimatePresence>

      <motion.div layout className="w-full sm:max-w-[160px] flex-1">
        <Select
          label="Estado"
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={[filtros.estadoCotizacion]}
          radius="sm"
          size="sm"
          onChange={(e) =>
            handleChangeFiltro("estadoCotizacion", e.target.value)
          }
          classNames={selectClassNames}
        >
          <SelectItem key="todos">Todos</SelectItem>
          <SelectItem key="Activo">Activo</SelectItem>
          <SelectItem key="Anulado">Anulado</SelectItem>
          <SelectItem key="Facturar">Facturar</SelectItem>
        </Select>
      </motion.div>

      <motion.div layout>
        <Button
          color="primary"
          type="submit"
          radius="sm"
          className="font-medium bg-slate-900 shadow-sm shadow-primary/30"
          startContent={<FiSearch className="text-lg" />}
        >
          Buscar
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default FiltrarCotizaciones;
