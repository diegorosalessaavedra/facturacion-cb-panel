import { motion } from "framer-motion";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { PiUserFill } from "react-icons/pi";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { FiFileText } from "react-icons/fi";
import { Search } from "lucide-react";
const FlitroApertura = ({
  dataFiltros,
  setdataFiltros,
  handleFindAperturas,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <section className="w-fit flex gap-2 items-end">
      <motion.div variants={itemVariants} className="min-w-[250px]">
        <Input
          type="text"
          labelPlacement="outside"
          label="Nombre del Trabajador"
          variant="bordered"
          startContent={<PiUserFill className="text-default-400" size={16} />}
          classNames={inputClassNames}
          onChange={(e) =>
            setdataFiltros((prev) => ({
              ...prev,
              nombre: e.target.value,
            }))
          }
          value={dataFiltros?.nombre}
          isRequired
          size="sm"
        />
      </motion.div>
      <motion.div variants={itemVariants} className="min-w-[150px]">
        <Input
          type="date"
          labelPlacement="outside"
          label="Fecha Inicio"
          variant="bordered"
          classNames={inputClassNames}
          onChange={(e) =>
            setdataFiltros((prev) => ({
              ...prev,
              fecha_inicio: e.target.value,
            }))
          }
          value={dataFiltros?.fecha_inicio}
          isRequired
          size="sm"
        />
      </motion.div>{" "}
      <motion.div variants={itemVariants} className="min-w-[150px]">
        <Input
          type="date"
          labelPlacement="outside"
          label="Fecha Final"
          variant="bordered"
          classNames={inputClassNames}
          onChange={(e) =>
            setdataFiltros((prev) => ({
              ...prev,
              fecha_final: e.target.value,
            }))
          }
          value={dataFiltros?.fecha_final}
          isRequired
          size="sm"
        />
      </motion.div>
      <motion.div variants={itemVariants} className="min-w-[150px]">
        <Select
          label="Estado Apertura"
          labelPlacement="outside"
          variant="bordered"
          startContent={<FiFileText className="text-default-400" size={16} />}
          classNames={selectClassNames}
          onChange={(e) =>
            setdataFiltros((prev) => ({
              ...prev,
              estado: e.target.value,
            }))
          }
          selectedKeys={[dataFiltros?.estado]}
          isRequired
          size="sm"
        >
          <SelectItem key="TODOS" value="TODOS">
            TODOS
          </SelectItem>
          <SelectItem key="APERTURADO" value="APERTURADO">
            APERTURADO
          </SelectItem>
          <SelectItem key="ANULADO" value="ANULADO">
            ANULADO
          </SelectItem>
        </Select>
      </motion.div>
      <Button
        className="bg-amber-400 text-black font-bold ml-4 shadow-xs shadow-amber-400"
        startContent={<Search size={16} />}
        onPress={handleFindAperturas}
      >
        Filtrar
      </Button>
    </section>
  );
};

export default FlitroApertura;
