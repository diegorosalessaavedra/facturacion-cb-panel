import { motion } from "framer-motion";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { FiFileText } from "react-icons/fi";
import { Search, User } from "lucide-react";

const FiltroHistoricoRendicion = ({
  trabajadores = [],
  categorias = [],
  dataFiltros,
  setdataFiltros,
  handleFindRendiciones,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Función genérica para evitar repetir código
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setdataFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault(); // CORREGIDO: Antes e.prevent()
    handleFindRendiciones();
  };

  return (
    <form className="w-fit flex gap-2 items-end" onSubmit={submit}>
      <motion.div
        className="flex gap-2 items-end"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div variants={itemVariants} className="min-w-[250px]">
          <Select
            isRequired
            name="trabajador_id" // Usamos el name para la función genérica
            label="Trabajador"
            labelPlacement="outside"
            placeholder="Seleccionar..."
            variant="bordered"
            startContent={<User className="text-default-400" size={16} />}
            classNames={selectClassNames}
            onChange={handleInputChange}
            selectedKeys={
              dataFiltros?.trabajador_id
                ? [String(dataFiltros.trabajador_id)]
                : []
            }
            size="sm"
          >
            {trabajadores.map((t) => (
              <SelectItem
                key={t.id}
                value={t.id}
                textValue={t.nombre_trabajador}
              >
                <span className="text-xs">{t.nombre_trabajador}</span>
              </SelectItem>
            ))}
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="min-w-[150px]">
          <Input
            name="fecha_inicio"
            type="date"
            label="Fecha Inicio"
            labelPlacement="outside"
            variant="bordered"
            classNames={inputClassNames}
            onChange={handleInputChange}
            value={dataFiltros?.fecha_inicio || ""}
            size="sm"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="min-w-[150px]">
          <Input
            name="fecha_final"
            type="date"
            label="Fecha Final"
            labelPlacement="outside"
            variant="bordered"
            classNames={inputClassNames}
            onChange={handleInputChange}
            value={dataFiltros?.fecha_final || ""}
            size="sm"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="min-w-[200px]">
          <Select
            name="categoria_gasto"
            label="Categoría del gasto"
            labelPlacement="outside"
            variant="bordered"
            startContent={<FiFileText className="text-default-400" size={16} />}
            classNames={selectClassNames}
            onChange={handleInputChange}
            selectedKeys={
              dataFiltros?.categoria_gasto ? [dataFiltros.categoria_gasto] : []
            }
            size="sm"
          >
            {categorias.map((c) => (
              <SelectItem key={c.categoria} textValue={c.categoria}>
                <span className="text-xs">{c.categoria}</span>
              </SelectItem>
            ))}
          </Select>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="bg-amber-400 text-black font-bold ml-4 shadow-md shadow-amber-400/20"
            startContent={<Search size={16} />}
            size="sm"
          >
            Buscar
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
};

export default FiltroHistoricoRendicion;
